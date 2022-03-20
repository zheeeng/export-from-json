import { normalizeFileName } from '../src/utils'

describe('normalizeFileName', () => {
  it('works correctly', () => {
    expect(normalizeFileName('download', 'txt', name => name.replace(/\s+/, '_'))).toEqual('download.txt')
  })

  it('works with extension', () => {
    expect(normalizeFileName('download', 'css', name => name.replace(/\s+/, '_'))).toEqual('download.css')
  })
})
