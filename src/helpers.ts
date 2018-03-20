export function downloadFile (dataURI: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = dataURI

  anchor.download = fileName
  anchor.setAttribute('style', 'visibility:hidden')

  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
