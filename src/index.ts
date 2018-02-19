import { assertIsArray, getKeys, getValues, getEntries, normalizeFileName } from './utils'

export type ValidType = string | number | null | boolean | object

export type RawData = Array<{
  [key: string]: ValidType,
}>

export type ExportType = 'txt' | 'json' | 'csv' | 'xls'

export interface IOption {
  data: RawData
  fileName?: string
  exportType?: ExportType
}

export interface ITableMap {
  [key: string]: string[],
}

function createTableMap (data: RawData): ITableMap {
  return data.map(getEntries).reduce(
    (tableMap, rowKVs, rowIndex) =>
      rowKVs.reduce(
        (map, [key, value]) => {
          const columnValues = map[key] || Array(rowIndex).map(_ => '')
          columnValues[rowIndex] =
            (typeof value !== 'string' ? JSON.stringify(value) : value) || ''
          map[key] = columnValues

          return map
        },
        tableMap,
      ),
    Object.create(null) as ITableMap,
  )
}

function createCSVData (data: RawData) {
  const tableMap = createTableMap(data)
  const head = getKeys(tableMap).join(',') + '\r\n'
  const columns = getValues(tableMap).map(column => column.map(value => `"${value.replace(/\"/g, '""')}"`))
  const rows = columns.reduce(
    (mergedColumn, column) => mergedColumn.map((value, rowIndex) => `${value},${column[rowIndex]}`),
  )

  return head + rows.join('\r\n')
}

function renderTableHTMLText (data: RawData) {
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

function createXLSData (data: RawData) {
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

function downloadFile (dataURI: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = dataURI

  anchor.download = fileName
  anchor.setAttribute('style', 'visibility:hidden')

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

export default function exportFromJSON ({
  data,
  fileName = '',
  exportType = 'json',
}: IOption) {
  const MESSAGE_IS_ARRAY_FAIL =
    'Invalid export data. Please provide an array of JSON object'
  const MESSAGE_VALID_JSON_FAIL =
    'Invalid export data. Please provide an array of JSON object'
  const MESSAGE_UNKNOWN_EXPORT_TYPE = `Can't export unknown data type ${exportType}.`

  let jsonStringifiedContent: string
  let dataURI: string
  let content: string

  try {
    jsonStringifiedContent = JSON.stringify(data, null, 4)
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }

  switch (exportType) {
    case 'txt':
      content = jsonStringifiedContent
      dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'txt'))
      break
    case 'json':
      content = jsonStringifiedContent
      dataURI =
        'data:application/json;charset=utf-8,' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'json'))
      break
    case 'csv':
      assertIsArray(data, MESSAGE_IS_ARRAY_FAIL)
      content = createCSVData(data)
      dataURI =
        'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'csv'))
      break
    case 'xls':
      assertIsArray(data, MESSAGE_IS_ARRAY_FAIL)
      content = createXLSData(data)
      dataURI =
        'data:application/vnd.ms-excel;charset=utf-8,' +
        encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'xls'))
      break
    default:
      throw new Error(MESSAGE_UNKNOWN_EXPORT_TYPE)
  }
}
