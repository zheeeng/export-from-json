import { assertIsArray, normalizeFileName } from './utils'
import { downloadFile } from './processors'
import { _prepareData, _createJSONData, createCSVData, createXLSData } from './converters'
import ExportType from './ExportType'

export interface IOption<R> {
  data: object | string
  fileName?: string
  exportType?: ExportType
  replacer?: ((key: string, value: any) => any) | Array<number | string> | null,
  space?: string | number
  processor?: (content: string, type: ExportType, fileName: string) => R,
  withBOM?: boolean,
}

function exportFromJSON<R> ({
  data,
  fileName = 'download',
  exportType = 'txt',
  replacer = null,
  space = 4,
  processor = downloadFile as any,
  withBOM = false,
}: IOption<R>): R {
  const MESSAGE_IS_ARRAY_FAIL = 'Invalid export data. Please provide an array of object'
  const MESSAGE_UNKNOWN_EXPORT_TYPE = `Can't export unknown data type ${exportType}.`

  const safeData = _prepareData(data)

  const JSONData = _createJSONData(safeData, replacer, space)

  switch (exportType) {
    case 'txt': {
      return processor(JSONData, exportType, normalizeFileName(fileName, 'txt'))
    }
    case 'json': {
      return processor(JSONData, exportType, normalizeFileName(fileName, 'json'))
    }
    case 'csv': {
      assertIsArray(safeData, MESSAGE_IS_ARRAY_FAIL)
      const BOM = '\ufeff'
      const CSVData = createCSVData(safeData as any[])
      const content = withBOM ? BOM + CSVData : CSVData

      return processor(content, exportType, normalizeFileName(fileName, 'csv'))
    }
    case 'xls': {
      assertIsArray(safeData, MESSAGE_IS_ARRAY_FAIL)
      const content = createXLSData(safeData as any[])

      return processor(content, exportType, normalizeFileName(fileName, 'xls'))
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
