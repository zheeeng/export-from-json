import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

test('createXLSData works correctly', () => {
  expect(createXLSData(testTableItems)).toMatchSnapshot()
})

test('createXLSData works with empty array', () => {
  expect(createXLSData([])).toEqual('')
})
