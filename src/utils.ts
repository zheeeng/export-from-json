export function isArray (data: any): data is any[] {
  return Object.prototype.toString.call(data) === '[object Array]'
}

export function assertIsArray (data: any, message: string) {
  if (!isArray(data)) {
    throw new Error(message)
  }
}

export function getValues<T> (data: Record<string, T>) {
  return Object.keys(data).map(key => data[key])
}

export function getKeys<T> (data: Record<string, T>) {
  return Object.keys(data)
}

export function getEntries<T> (data: Record<string, T>) {
  return Object.keys(data).map(key => [key, data[key]] as [string, T])
}

export function normalizeFileName (fileName: string, extension: string) {
  const suffix = '.' + extension
  const extensionPattern = new RegExp(`(\\${extension})?$`)

  return fileName.replace(/\s+/, '_').replace(extensionPattern, suffix)
}

export function normalizeXMLName (name: string) {
  '555xmlHello .  world!'.trim().replace(/^([0-9,;]|(xml))+/, '')

  return name.replace(/[^_a-zA-Z 0-9:\-\.]/g, '').replace(/^([ 0-9-:\-\.]|(xml))+/i, '').replace(/ +/g, '-')
}

export function indent (spaces: number) {
  return Array(spaces + 1).join(' ')
}

export function stripHTML (text: string) {
  return text.replace(/([<>&])/g, (_, $1) => {
    switch ($1) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      default: return ''
    }
  })
}
