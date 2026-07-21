import { assert, isArray, normalizeFileName } from './utils.js'
import { downloadFile } from './processors.js'
import { _prepareData, _createJSONData, createCSVData, createXLSData, createXMLData, _createFieldsMapper } from './converters.js'
import { exportTypes, ExportType } from './types.js'
export interface IOption<R = void> {
  data: object | string
  fileName?: string
  extension?: string
  fileNameFormatter?: (name: string) => string
  fields?: string[] | Record<string, string>
  exportType?: ExportType
  replacer?: ((key: string, value: any) => any) | Array<number | string> | null
  space?: string | number
  processor?: (content: string, type: ExportType, fileName: string) => R
  withBOM?: boolean
  beforeTableEncode?: (
    tableRow: Array<{ fieldName: string, fieldValues: string[] }>,
  ) => Array<{ fieldName: string, fieldValues: string[]}>
  delimiter?: ',' | ';'
}

function isTableData (data: unknown): data is Array<Record<string, unknown>> {
  return isArray(data) && data.every(row => row !== null && typeof row === 'object' && !isArray(row))
}

function exportFromJSON<R = void> ({
  data,
  fileName = 'download',
  extension,
  fileNameFormatter = name => name.replace(/\s+/, '_'),
  fields,
  exportType = 'txt',
  replacer = null,
  space = 4,
  processor = downloadFile as never,
  withBOM = false,
  beforeTableEncode = (i) => i,
  delimiter = ',',
}: IOption<R>): R {
  const MESSAGE_IS_ARRAY_FAIL = 'Invalid export data. Please provide an array of objects'
  const MESSAGE_UNKNOWN_EXPORT_TYPE = `Can't export unknown data type ${exportType}.`
  if (typeof data === 'string' && (exportType === 'txt' || exportType === 'css' || exportType === 'html')) {
    return processor(data, exportType, normalizeFileName(fileName, extension ?? exportType, fileNameFormatter))
  }

  const fieldsMapper = _createFieldsMapper(fields)
  const preparedData = _prepareData(data)
  const safeData = fields
    ? fieldsMapper(preparedData as Record<string, unknown> | Array<Record<string, unknown>>)
    : preparedData

  const JSONData = _createJSONData(safeData as object, replacer, space)
  switch (exportType) {
    case 'txt':
    case 'css':
    case 'html': {
      return processor(JSONData, exportType, normalizeFileName(fileName, extension ?? exportType, fileNameFormatter))
    }
    case 'json': {
      return processor(JSONData, exportType, normalizeFileName(fileName, extension ?? 'json', fileNameFormatter))
    }
    case 'csv': {
      assert(isTableData(safeData), MESSAGE_IS_ARRAY_FAIL)
      const BOM = '\ufeff'
      const CSVData = createCSVData(safeData, { beforeTableEncode, delimiter })
      const content = withBOM ? BOM + CSVData : CSVData

      return processor(content, exportType, normalizeFileName(fileName, extension ?? 'csv', fileNameFormatter))
    }
    case 'xls': {
      assert(isTableData(safeData), MESSAGE_IS_ARRAY_FAIL)
      const content = createXLSData(safeData, { beforeTableEncode })

      return processor(content, exportType, normalizeFileName(fileName, extension ?? 'xls', fileNameFormatter))
    }
    case 'xml': {
      const content = createXMLData(safeData as object)

      return processor(content, exportType, normalizeFileName(fileName, extension ?? 'xml', fileNameFormatter))
    }
    default:
      throw new Error(MESSAGE_UNKNOWN_EXPORT_TYPE)
  }
}

exportFromJSON.types = exportTypes

exportFromJSON.processors = { downloadFile }

export default exportFromJSON
