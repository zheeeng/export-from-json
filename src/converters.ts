import { RawData } from './interface'
import { getKeys, getValues, getEntries } from './utils'

export function createJSONData (data: RawData) {
  return JSON.stringify(data, null, 4)
}

export interface ITableMap {
  [key: string]: string[],
}

export function createTableMap (data: RawData): ITableMap {
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

export function createCSVData (data: RawData) {
  const tableMap = createTableMap(data)
  const head = getKeys(tableMap).join(',') + '\r\n'
  const columns = getValues(tableMap).map(column => column.map(value => `"${value.replace(/\"/g, '""')}"`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value},${column[rowIndex]}`),
  )

  return head + rows.join('\r\n')
}

export function renderTableHTMLText (data: RawData) {
  const tableMap = createTableMap(data)
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

export function createXLSData (data: RawData) {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
      </head >
      <body>
        ${renderTableHTMLText(data)}
      </body>
    </html >
  `
}
