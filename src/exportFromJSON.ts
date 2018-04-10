import { assertIsArray, normalizeFileName } from './utils'
import { downloadFile } from './processors'
import { _createJSONData, createCSVData, createXLSData } from './converters'
import ExportType from './ExportType'

export interface IOption {
  data: object
  fileName?: string
  exportType?: ExportType
  replacer?: string[] | ((key: string, value: any, path: string, depth: number) => void)
  depth?: number
  space?: string | number
  processor?: (data: string, fileName: string) => void
}

function exportFromJSON ({
  data,
  fileName = '',
  exportType = 'json',
  replacer,
  depth = -1,
  space = 4,
  processor = downloadFile,
}: IOption) {
  const MESSAGE_IS_ARRAY_FAIL =
    'Invalid export data. Please provide an array of JSON object'
  const MESSAGE_UNKNOWN_EXPORT_TYPE = `Can't export unknown data type ${exportType}.`

  const JSONData = _createJSONData(data)

  switch (exportType) {
    case 'txt': {
      const content = JSONData
      const dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      processor(dataURI, normalizeFileName(fileName, 'txt'))
      break
    }
    case 'json': {
      const content = JSONData
      const dataURI =
        'data:application/json;charset=utf-8,' + encodeURIComponent(content)
      processor(dataURI, normalizeFileName(fileName, 'json'))
      break
    }
    case 'csv': {
      assertIsArray(data, MESSAGE_IS_ARRAY_FAIL)
      const content = createCSVData(data as any[])
      const dataURI =
        'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content)
      processor(dataURI, normalizeFileName(fileName, 'csv'))
      break
    }
    case 'xls': {
      assertIsArray(data, MESSAGE_IS_ARRAY_FAIL)
      const content = createXLSData(data as any[])
      const dataURI =
        'data:application/vnd.ms-excel;charset=utf-8,' +
        encodeURIComponent(content)
      processor(dataURI, normalizeFileName(fileName, 'xls'))
      break
    }
    default:
      throw new Error(MESSAGE_UNKNOWN_EXPORT_TYPE)
  }
}

namespace exportFromJSON {
  export const types = {
    txt : 'txt',
    json : 'json',
    csv : 'csv',
    xls : 'xls',
  }
  export const processors = { downloadFile }
}

export default exportFromJSON
