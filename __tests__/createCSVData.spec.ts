import { testTableItems, testTableItems2, beforeTableEncode } from './shared/data'
import { createCSVData } from '../src/converters'

test('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems)).toMatchSnapshot()
  expect(createCSVData(testTableItems2)).toMatchSnapshot()
})

test('createCSVData works correctly with specifying beforeTableEncode option', () => {
  expect(createCSVData(testTableItems, { beforeTableEncode })).toMatchSnapshot()
})
test('createCSVData works correctly with delimiter option', () => {
  expect(createCSVData(testTableItems, { delimiter: ';' })).toMatchSnapshot()
})

test('createCSVData works with empty array', () => {
  expect(createCSVData([])).toEqual('')
})
