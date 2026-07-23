export type ExportType = 'txt' | 'json' | 'csv' | 'tsv' | 'xls' | 'xml' | 'css' | 'html'

export type TableRow = Record<string, unknown>

export interface TableEntry {
  fieldName: string
  fieldValues: string[]
}

export type TableEntries = TableEntry[]

export const exportTypes: { [ET in ExportType]: ET } = {
    txt : 'txt',
    css : 'css',
    html : 'html',
    json : 'json',
    csv : 'csv',
    tsv : 'tsv',
    xls : 'xls',
    xml : 'xml',
}
