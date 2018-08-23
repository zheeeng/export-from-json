import ExportType from './ExportType'

export function generateDataURI (content: string, type: ExportType): string {
  switch (type) {
    case 'txt': {
      return 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    }
    case 'json': {
      return 'data:application/json;charset=utf-8,' + encodeURIComponent(content)
    }
    case 'csv': {
      return 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(content)
    }
    case 'xls': {
      return 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(content)
    }
    default : {
      return ''
    }
  }
}

export function downloadFile (content: string, type: ExportType, fileName: string = 'download'): void {
  const dataURI = generateDataURI(content, type)

  const anchor = document.createElement('a')
  anchor.href = dataURI

  anchor.download = fileName
  anchor.setAttribute('style', 'visibility:hidden')

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
