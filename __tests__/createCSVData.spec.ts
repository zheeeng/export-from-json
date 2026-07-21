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

test('createCSVData escapes field names', () => {
  expect(createCSVData([{ 'first,name': 'Ada', 'say"hello': 'yes' }]))
    .toEqual('"first,name","say""hello"\r\nAda,yes')
})

test('createCSVData works with rows that have no fields', () => {
  expect(createCSVData([{}])).toEqual('')
})
