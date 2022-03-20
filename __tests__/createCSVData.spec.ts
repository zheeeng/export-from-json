import { testTableItems } from './shared/data'
import { createCSVData } from '../src/converters'

test('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems)).toMatchSnapshot()
})

test('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems, ';')).toMatchSnapshot()
})

test('createCSVData works with empty array', () => {
  expect(createCSVData([])).toEqual('')
})
