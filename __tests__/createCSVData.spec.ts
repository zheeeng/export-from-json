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

test('createCSVData preserves legitimate values and field names by default', () => {
  expect(createCSVData([{ '-balance': -42, phone: '+8613800000000' }]))
    .toEqual('-balance,phone\r\n-42,+8613800000000')
})

test('createCSVData escapes formula-like cell values only when enabled', () => {
  expect(createCSVData([{ '-balance': '=1+1', note: '@SUM(A1)' }], { escapeFormulae: true }))
    .toEqual("-balance,note\r\n'=1+1,'@SUM(A1)")
})
