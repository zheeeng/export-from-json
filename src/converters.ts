import { getKeys, getValues, getEntries } from './utils'

// TODO:: execute toSchema implicit converting
export function _createJSONData (
  data: object,
  replacer: ((key: string, value: any) => any) | Array<number | string> | null = null,
  space: string | number,
) {
  const MESSAGE_VALID_JSON_FAIL = 'Invalid export data. Please provide JSON object'
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

export function createCSVData (data: any[]) {
  const tableMap = _createTableMap(data)
  const head = getKeys(tableMap).join(',') + '\r\n'
  const columns = getValues(tableMap).map(column => column.map(value => `"${value.replace(/\"/g, '""')}"`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value},${column[rowIndex]}`),
  )

  return head + rows.join('\r\n')
}

export function _renderTableHTMLText (data: any[]) {
  const tableMap = _createTableMap(data)
  const head = getKeys(tableMap)
  const columns = getValues(tableMap).map(column => column.map(value => `<td>${value}</td>`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value}${column[rowIndex]}`),
  )

  return `
    <table>
      <thead><tr><th><b>${head.join('</b></th><th><b>')}</b></th></tr></thead>
      <tbody><tr>${rows.join('</tr><tr>')}</tr></tbody>
    </table>
  `
}

export function createXLSData (data: any[]) {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
      </head >
      <body>
        ${_renderTableHTMLText(data)}
      </body>
    </html >
  `
}
