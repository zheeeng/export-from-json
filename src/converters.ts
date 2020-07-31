import { isArray, getKeys, getValues, getEntries, normalizeXMLName, indent, stripHTML, assert } from './utils'

export function _prepareData (data: object | string): object {
  const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide a valid JSON'
  try {
    return typeof data === 'string' ? JSON.parse(data) as object : data
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }
}

// TODO:: execute toSchema implicit converting
export function _createJSONData (
  data: object,
  replacer: ((key: string, value: any) => any) | Array<number | string> | null = null,
  space: string | number,
) {
  const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide valid JSON object'
  try {
    return JSON.stringify(data, replacer as any, space)
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }
}

export interface ITableMap {
  [key: string]: string[],
}

export function _createTableMap (data: any[]): ITableMap {
  return data.map(getEntries).reduce(
    (tMap, rowKVs, rowIndex) =>
      rowKVs.reduce(
        (map, kv) => {
          const key = kv[0]
          const value = kv[1]
          const columnValues = map[key] || Array.from({ length: data.length }).map(_ => '')
          columnValues[rowIndex] =
            (typeof value !== 'string' ? JSON.stringify(value) : value) || ''
          map[key] = columnValues

          return map
        },
        tMap,
      ),
    Object.create(null) as Partial<ITableMap>,
  ) as ITableMap
}

export function createCSVData (data: any[], delimiter: string = ',') {
  if (!data.length) return ''

  const tableMap = _createTableMap(data)
  const head = getKeys(tableMap).join(delimiter) + '\r\n'
  const columns = getValues(tableMap).map(column => column.map(value => `"${value.replace(/\"/g, '""')}"`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value}${delimiter}${column[rowIndex]}`),
  )

  return head + rows.join('\r\n')
}

export function _renderTableHTMLText (data: any[]) {
  assert(data.length > 0)

  const tableMap = _createTableMap(data)
  const head = getKeys(tableMap)
  const columns = getValues(tableMap).map(column => column.map(value => `<td>${value}</td>`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value}${column[rowIndex]}`),
  )

  return `
    <table>
      <thead>
        <tr><th><b>${head.join('</b></th><th><b>')}</b></th></tr>
      </thead>
      <tbody>
        <tr>${rows.join(`</tr>
        <tr>`)}</tr>
      </tbody>
    </table>
  `
}

export function createXLSData (data: any[]) {
  if (!data.length) return ''

  const content =

`<html>
  <head>
    <meta charset="UTF-8">
  </head >
  <body>
    ${_renderTableHTMLText(data)}
  </body>
</html >
`

  return content
}

export function createXMLData (data: object) {
  const content =

`<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>
${_renderXML(data, 'base')}
`

  return content
}

function _renderXML (data: any, tagName: string, arrayElementTag = 'element', spaces = 0): string {
  const tag = normalizeXMLName(tagName)
  const indentSpaces = indent(spaces)

  if (data === null || data === undefined) {
    return `${indentSpaces}<${tag} />`
  }

  const content = isArray(data)
    ? data.map(item => _renderXML(item, arrayElementTag, arrayElementTag, spaces + 2)).join('\n')
    : typeof data === 'object'
      ? getEntries(data as Record<string, any>)
        .map(([key, value]) => _renderXML(value, key, arrayElementTag, spaces + 2)).join('\n')
      : indentSpaces + '  ' + stripHTML(String(data))

  const contentWithWrapper =

`${indentSpaces}<${tag}>
${content}
${indentSpaces}</${tag}>`

  return contentWithWrapper
}
