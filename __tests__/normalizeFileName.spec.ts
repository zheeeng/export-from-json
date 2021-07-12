import { normalizeFileName } from '../src/utils'

it('normalizeFileName works correctly', () => {
  expect(normalizeFileName('download', 'txt', name => name.replace(/\s+/, '_'))).toEqual('download.txt')
})

it('normalizeFileName with extension works correctly', () => {
  expect(normalizeFileName('download', 'css', name => name.replace(/\s+/, '_'))).toEqual('download.css')
})
