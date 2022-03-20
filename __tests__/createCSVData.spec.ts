import { testTableItems, beforeTableEncode } from './shared/data'
import { createCSVData } from '../src/converters'

test('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems)).toMatchSnapshot()
})

test('createCSVData works correctly with specifying delimiter option', () => {
  expect(createCSVData(testTableItems, ';')).toMatchSnapshot()
})

test('createCSVData works correctly with specifying beforeTableEncode option', () => {


  expect(createCSVData(testTableItems, ';', beforeTableEncode)).toMatchSnapshot()
})

test('createCSVData works with empty array', () => {
  expect(createCSVData([])).toEqual('')
})
