import type { ITableEntries } from '../../src/converters'

export const testTableItems = [
  { greeting: 'hello' },
  { foo: 'foo', bar: 'bar' },
  { a: 100, b: [ 1, 2, 3 ], c: { x: 200, y: 300 }, d: 'D', e: null, f: undefined },
]

export const testTableItems2 = [
  { greeting: 'hel"lo' },
  { foo: 'foo', bar: 'b"a"r' },
  { a: 100, b: [ 1, 2, 3 ], c: { x: 200, y: 300 }, d: 'D', e: null, f: undefined },
]

export const testTableMap = {
  greeting: ['hello', '', ''],
  foo: ['', 'foo', ''],
  bar: ['', 'bar', ''],
  a: ['', '', '100'],
  b: ['', '', JSON.stringify([1, 2, 3])],
  c: ['', '', JSON.stringify({ x: 200, y: 300 })],
  d: ['', '', 'D'],
  e: ['', '', 'null'],
  f: ['', '', ''],
}

export const resultOfTestTableMap = [
  {
      fieldName: 'greeting',
      fieldValues: ['hello', '', ''],
  },
  {
      fieldName: 'foo',
      fieldValues: ['', 'foo', ''],
  },
  {
    fieldName: 'bar',
    fieldValues: ['', 'bar', ''],
  },
  {
      fieldName: 'a',
      fieldValues: ['', '', '100'],
  },
  {
      fieldName: 'b',
      fieldValues: ['', '', JSON.stringify([1, 2, 3])],
  },
  {
      fieldName: 'c',
      fieldValues: ['', '', JSON.stringify({ x: 200, y: 300 })],
  },
  {
      fieldName: 'd',
      fieldValues: ['', '', 'D'],
  },
  {
      fieldName: 'e',
      fieldValues: ['', '', 'null'],
  },
  {
      fieldName: 'f',
      fieldValues: ['', '', ''],
  },
]

export const sortedOfTestTableMap = [
  {
      fieldName: 'a',
      fieldValues: ['', '', '100'],
  },
  {
      fieldName: 'b',
      fieldValues: ['', '', JSON.stringify([1, 2, 3])],
  },
  {
      fieldName: 'bar',
      fieldValues: ['', 'bar', ''],
  },
  {
      fieldName: 'c',
      fieldValues: ['', '', JSON.stringify({ x: 200, y: 300 })],
  },
  {
      fieldName: 'd',
      fieldValues: ['', '', 'D'],
  },
  {
      fieldName: 'e',
      fieldValues: ['', '', 'null'],
  },
  {
      fieldName: 'f',
      fieldValues: ['', '', ''],
  },
  {
      fieldName: 'foo',
      fieldValues: ['', 'foo', ''],
  },
  {
      fieldName: 'greeting',
      fieldValues: ['hello', '', ''],
  }
]

export const fields1 = ['greeting']
export const fieldsMapperObj1 = { greeting: 'greet' } 

export const testTableItemsWithFields1 = [
  { greeting: 'hello' },
]
export const testTableItemsWithFieldsMapperObj1 = [
  { greet: 'hello' },
]

export const fields2 = ['greeting', 'bar', 'd']
export const fieldsMapperObj2 = { greeting: 'greet', 'bar': 'baz', 'd': 'ddd' } 

export const testTableItemsWithFields2 = [
  { greeting: 'hello' }, { bar: 'bar' }, { 'd': 'D' },
]
export const testTableItemsWithFieldsMapperObj2 = [
  { greet: 'hello' }, { 'baz': 'bar' }, { 'ddd': 'D' },
]

// multiply numeric field values
export const beforeTableEncode = (rows: ITableEntries) => rows.map(row => ({
  fieldName: row.fieldName,
  fieldValues: row.fieldValues.map(value => isNaN(+value) ? value : (+value * 10).toString()),
}))

// sort field names alphabetically
export const beforeTableEncode2 = (rows: ITableEntries) => rows.sort((p, c) => p.fieldName.localeCompare(c.fieldName))