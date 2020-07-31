import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

it('createXLSData works correctly', () => {
  expect(createXLSData(testTableItems)).toMatchSnapshot()
})

it('createXLSData works with empty array', () => {
  expect(createXLSData([])).toEqual('')
})
