import { normalizeFileName } from '../src/utils'

describe('normalizeFileName', () => {
  it('works correctly', () => {
    expect(normalizeFileName('download', 'txt', name => name.replace(/\s+/, '_'))).toEqual('download.txt')
  })

  it('works with extension', () => {
    expect(normalizeFileName('download.css', 'css', name => name.replace(/\s+/, '_'))).toEqual('download.css')
  })

  it('treats a custom extension as plain text', () => {
    expect(normalizeFileName('archive', 'tar.gz', name => name)).toEqual('archive.tar.gz')
    expect(normalizeFileName('archive.tar.gz', 'tar.gz', name => name)).toEqual('archive.tar.gz')
  })
})
