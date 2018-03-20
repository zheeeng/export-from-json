import { RawData } from './interface'
import { assertIsArray, normalizeFileName } from './utils'
import { downloadFile } from './helpers'
import { createJSONData, createCSVData, createXLSData } from './converters'
import ExportType from './ExportType'
export interface IOption {
  data: RawData
  fileName?: string
  exportType?: ExportType
}

export interface ExportFromJSON {
  (option: IOption): void,
  ExportType: typeof ExportType
}

function efj ({
  data,
  fileName = '',
  exportType = 'json',
}: IOption) {
  const MESSAGE_IS_ARRAY_FAIL =
    'Invalid export data. Please provide an array of JSON object'
  const MESSAGE_VALID_JSON_FAIL =
    'Invalid export data. Please provide JSON object'
  const MESSAGE_UNKNOWN_EXPORT_TYPE = `Can't export unknown data type ${exportType}.`

  let JSONData: string
  let dataURI: string
  let content: string

  try {
    JSONData = createJSONData(data)
  } catch {
    throw new Error(MESSAGE_VALID_JSON_FAIL)
  }

  switch (exportType) {
    case ExportType.txt:
      content = JSONData
      dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'txt'))
      break
    case ExportType.json:
      content = JSONData
      dataURI =
        'data:application/json;charset=utf-8,' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'json'))
      break
    case ExportType.csv:
      assertIsArray(data, MESSAGE_IS_ARRAY_FAIL)
      content = createCSVData(data)
      dataURI =
        'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content)
      downloadFile(dataURI, normalizeFileName(fileName, 'csv'))
      break
    case ExportType.xls:
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

const exportFromJSON = efj as ExportFromJSON

exportFromJSON.ExportType = ExportType

export default exportFromJSON
