import type { TableEntries, TableRow } from './types.js'
import { isArray, getEntries, normalizeXMLName, indent, stripHTML, escapeHTML, assert, getKeys } from './utils.js'

export function _createFieldsMapper (fields?: string[] | Record<string, string>) {
  if (
    !fields
    || isArray(fields) && !fields.length
    || !isArray(fields) && !getKeys(fields).length
  ) return (item: Record<string, unknown> | Array<Record<string, unknown>>) => item

  const mappings = isArray(fields)
    ? fields.map(key => [key, key] as [string, string])
    : getEntries(fields)

  const targetNames = new Set<string>()
  mappings.forEach(([, targetName]) => {
    assert(!targetNames.has(targetName), 'Field aliases must be unique')
    targetNames.add(targetName)
  })

  const project = (item: Record<string, unknown>) => mappings.reduce(
    (map, [sourceName, targetName]) => {
      map[targetName] = Object.prototype.hasOwnProperty.call(item, sourceName)
        ? item[sourceName]
        : undefined

      return map
    },
    Object.create(null) as Record<string, unknown>,
  )

  return (item: Record<string, unknown> | Array<Record<string, unknown>>) => {
    return isArray(item) ? item.map(project) : project(item)
  }
}

export function _prepareData (data: object | string): unknown {
  const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON'
  try {
    assert(typeof data === 'string' || data !== null && typeof data === 'object')

    return typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }
}

// TODO:: execute toSchema implicit converting
export function _createJSONData (
  data: unknown,
  replacer: ((key: string, value: any) => any) | Array<number | string> | null = null,
  space: string | number,
) {
  const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide valid JSON data'
  try {
    const content = JSON.stringify(data, replacer as any, space)

    if (content === undefined) throw new Error(MESSAGE_VALID_JSON_FAIL)

    return content
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }
}

export interface ITableMap {
  [key: string]: string[],
}

function serializeTableValue (value: unknown) {
  return (typeof value !== 'string' ? JSON.stringify(value) : value) || ''
}

function getTableFields (data: TableRow[]) {
  const seen = new Set<string>()
  const fields: string[] = []

  data.forEach(row => {
    getKeys(row).forEach(field => {
      if (!seen.has(field)) {
        seen.add(field)
        fields.push(field)
      }
    })
  })

  return fields
}

export function _createTableMap (data: TableRow[]): ITableMap {
  return data.map(getEntries).reduce(
    (tMap, rowKVs, rowIndex) =>
      rowKVs.reduce(
        (map, [key, value]) => {
          const columnValues = map[key] || Array.from({ length: data.length }).map(() => '')
          columnValues[rowIndex] = serializeTableValue(value)
          map[key] = columnValues

          return map
        },
        tMap,
      ),
    Object.create(null) as Partial<ITableMap>,
  ) as ITableMap
}

export type ITableEntries = TableEntries

export function _createTableEntries (
  tableMap: ITableMap,
  beforeTableEncode: (entries: ITableEntries) => ITableEntries = i => i,
): ITableEntries {
  const sourceEntries = getEntries(tableMap).map(([fieldName, fieldValues]) => ({
    fieldName,
    fieldValues,
  }))
  const entries = beforeTableEncode(sourceEntries)

  assert(isArray(entries), 'beforeTableEncode must return an array of table entries')

  const rowCount = sourceEntries.length ? sourceEntries[0].fieldValues.length : 0
  const fieldNames = new Set<string>()

  entries.forEach(entry => {
    assert(
      entry !== null
      && typeof entry === 'object'
      && typeof entry.fieldName === 'string'
      && isArray(entry.fieldValues)
      && entry.fieldValues.every(value => typeof value === 'string'),
      'Each table entry must have a string fieldName and an array of string fieldValues',
    )
    assert(entry.fieldValues.length === rowCount, `Each table column must contain ${rowCount} values`)
    assert(!fieldNames.has(entry.fieldName), 'Table field names must be unique')
    fieldNames.add(entry.fieldName)
  })

  return entries
}

// Rule: Fields that contain commas must begin and end with double quotes.
// Addition Rule: Fields that contain double quotes must begin and end with double quotes.
// Rule: Fields that contain line breaks must begin and end with double quotes
//       (not all programs support values with line breaks).
// Rule: All other fields do not require double quotes.
// Rule: Double quotes within values are represented by two contiguous double quotes.
type TableDelimiter = ',' | ';' | '\t'

function encloser (value: string, delimiter: TableDelimiter, escapeFormulae = false) {
  const formulaStartPattern = /^[=+\-@\t\r]/
  const safeValue = escapeFormulae && formulaStartPattern.test(value) ? "'" + value : value

  const enclosingTester = new RegExp(`${delimiter}|"|\n`)
  const enclosingCharacter = enclosingTester.test(safeValue) ? '"' : ''
  const escaped = safeValue.replace(/"/g, '""')

  return `${enclosingCharacter}${escaped}${enclosingCharacter}`
}

interface CreateCSVDataOptions {
  beforeTableEncode?: (entries: ITableEntries) => ITableEntries,
  delimiter?: TableDelimiter,
  escapeFormulae?: boolean,
}

const defaultCreateCSVDataOption: Required<Omit<CreateCSVDataOptions, 'beforeTableEncode'>> = {
  delimiter: ',',
  escapeFormulae: false,
}

// Reference: https://techterms.com/definition/csv
export function createCSVData (
  data: TableRow[],
  options: CreateCSVDataOptions = {},
) {
  const { beforeTableEncode } = options
  const { delimiter, escapeFormulae } = { ...defaultCreateCSVDataOption, ...options }

  if (!data.length) return ''

  if (!beforeTableEncode) {
    const fields = getTableFields(data)

    if (!fields.length) return ''

    const head = fields.map(field => encloser(field, delimiter)).join(delimiter) + '\r\n'
    const rows = data.map(row => fields.map(field => encloser(
      Object.prototype.hasOwnProperty.call(row, field)
        ? serializeTableValue(row[field])
        : '',
      delimiter,
      escapeFormulae,
    )).join(delimiter))

    return head + rows.join('\r\n')
  }

  const tableMap = _createTableMap(data)
  const tableEntries = _createTableEntries(tableMap, beforeTableEncode)

  // Rule: Columns (fields) are separated by commas.
  // Rule: Rows are separated by line breaks (newline characters).
  if (!tableEntries.length) return ''

  const head = tableEntries.map(({ fieldName }) => encloser(fieldName, delimiter)).join(delimiter) + '\r\n'
  const columns = tableEntries.map(({ fieldValues }) => fieldValues)
    .map(column => column.map(value => encloser(value, delimiter, escapeFormulae)))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value}${delimiter}${column[rowIndex]}`),
  )

  return head + rows.join('\r\n')
}

export function _renderTableHTMLText (
  data: TableRow[],
  beforeTableEncode: (entries: ITableEntries) => ITableEntries,
) {
  assert(data.length > 0)

  const tableMap = _createTableMap(data)
  const tableEntries = _createTableEntries(tableMap, beforeTableEncode)

  if (!tableEntries.length) return ''

  const head = tableEntries.map(({ fieldName }) => escapeHTML(fieldName))
    .join('</b></th><th><b>')
  const columns = tableEntries.map(({ fieldValues }) => fieldValues)
    .map(column => column.map(value => `<td>${escapeHTML(value)}</td>`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn
      .map((value, rowIndex) => `${value}${column[rowIndex]}`),
  )

  return `
    <table>
      <thead>
        <tr><th><b>${head}</b></th></tr>
      </thead>
      <tbody>
        <tr>${rows.join(`</tr>
        <tr>`)}</tr>
      </tbody>
    </table>
  `
}

interface CreateXLSDataOptions {
  beforeTableEncode?: (entries: ITableEntries) => ITableEntries,
}

const defaultCreateXLSDataOptions: Required<CreateXLSDataOptions> = { beforeTableEncode: i => i }

export function createXLSData (data: TableRow[], options?: CreateXLSDataOptions) {
  const beforeTableEncode = options?.beforeTableEncode ?? defaultCreateXLSDataOptions.beforeTableEncode

  if (!data.length) return ''

  const table = _renderTableHTMLText(data, beforeTableEncode)

  if (!table) return ''

  const content =
`<html>
  <head>
    <meta charset="UTF-8" />
  </head >
  <body>
    ${table}
  </body>
</html >
`

  return content
}

export function createXMLData (data: unknown) {
  const content =

`<?xml version="1.0" encoding="utf-8"?>
${_renderXML(data, 'base')}
`

  return content
}

function _renderXML (
  data: unknown,
  tagName: string,
  arrayElementTag = 'element',
  spaces = 0,
  path = '$',
  ancestors: WeakSet<object> = new WeakSet<object>(),
): string {
  const normalizedTag = normalizeXMLName(tagName)
  const tag = normalizedTag || normalizeXMLName(arrayElementTag) || 'element'
  const sourceNameAttribute = tag === tagName ? '' : ` name="${escapeHTML(tagName)}"`
  const indentSpaces = indent(spaces)

  if (data === null || data === undefined) {
    return `${indentSpaces}<${tag}${sourceNameAttribute} />`
  }

  if (typeof data === 'object') {
    if (ancestors.has(data)) throw new Error(`Invalid export data. Circular reference found at ${path}`)
    ancestors.add(data)
  }

  let content: string

  try {
    content = isArray(data)
      ? data.map((item, index) => _renderXML(
          item,
          arrayElementTag,
          arrayElementTag,
          spaces + 2,
          `${path}[${index}]`,
          ancestors,
        )).join('\n')
      : typeof data === 'object'
        ? getEntries(data as Record<string, unknown>)
          .map(([key, value]) => {
            const childPath = /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`

            return _renderXML(value, key, arrayElementTag, spaces + 2, childPath, ancestors)
          }).join('\n')
        : indentSpaces + '  ' + stripHTML(String(data))
  } finally {
    if (typeof data === 'object') ancestors.delete(data)
  }

  const contentWithWrapper =

`${indentSpaces}<${tag}${sourceNameAttribute}>
${content}
${indentSpaces}</${tag}>`

  return contentWithWrapper
}
