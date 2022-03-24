import { testTableItems, testTableItems2, beforeTableEncode } from './shared/data'
import { createCSVData } from '../src/converters'

test('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems, {})).toMatchSnapshot()
})

test('createCSVData works correctly with specifying delimiter option', () => {
  expect(createCSVData(testTableItems, { delimiter: ';' })).toMatchSnapshot()
})

test('createCSVData works correctly with specifying encloser option', () => {
  expect(createCSVData(testTableItems, { encloser: '' })).toMatchSnapshot()
  expect(createCSVData(testTableItems2, { encloser: '' })).toMatchSnapshot()
})

test('createCSVData works correctly with specifying beforeTableEncode option', () => {


  expect(createCSVData(testTableItems, { delimiter: ';', beforeTableEncode })).toMatchSnapshot()
})

test('createCSVData works with empty array', () => {
  expect(createCSVData([], {})).toEqual('')
})
