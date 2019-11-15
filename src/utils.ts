import { Entry } from './interface'

export function assertIsArray (data: any, message: string) {
  if (Object.prototype.toString.call(data) !== '[object Array]') {
    throw new Error(message)
  }
}

export function getValues<T> (data: { [key: string]: T }) {
  return Object.keys(data).map(key => data[key])
}

export function getKeys<T> (data: { [key: string]: T }) {
  return Object.keys(data)
}

export function getEntries<T> (data: { [key: string]: T }) {
  return Object.keys(data).map(key => [key, data[key]] as Entry<T>)
}

export function normalizeFileName (fileName: string, extension: string) {
  const suffix = '.' + extension
  const extensionPattern = new RegExp(`(\\${extension})?$`)

  return fileName.replace(/\s+/, '_').replace(extensionPattern, suffix)
}

export function normalizeXMLName(data: string){
  return data.trim().replace(new RegExp(`^xml|[^a-zA-Z0-9 _\\-\\.:]+`,'gim'), "").replace(new RegExp(' ', 'gim'), '-').toLowerCase();
}

export function stripHTML(data: string) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = data;
  return tmp.textContent || tmp.innerText;
}
