import type { ExportType } from './types.js'

const mimeTypes: { [Type in ExportType]: string } = {
  txt: 'text/plain',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  xls: 'application/vnd.ms-excel',
  xml: 'application/xml',
}

export function generateDataURI (content: string, type: ExportType, byBlob: boolean): string {
  const blobType = `${mimeTypes[type]};charset=utf-8`

  if (byBlob) return URL.createObjectURL(new Blob([content], { type: blobType }))

  return `data:${blobType},` + encodeURIComponent(content)
}

export function downloadFile (content: string, type: ExportType, fileName: string = 'download', byBlob = true): void {
  const dataURI = generateDataURI(content, type, byBlob)

  const anchor = document.createElement('a')
  anchor.href = dataURI

  anchor.download = fileName
  anchor.setAttribute('style', 'visibility:hidden')

  document.body.appendChild(anchor)
  anchor.dispatchEvent(
    new MouseEvent('click', {
      bubbles: false,
      cancelable: false,
      view: window,
    }),
  )
  document.body.removeChild(anchor)

  if (byBlob) setTimeout(() => URL.revokeObjectURL(dataURI), 0)
}
