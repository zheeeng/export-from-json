export const testTableItems = [
  { greeting: 'hello' },
  { foo: 'foo', bar: 'bar' },
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

export const fields1 = ['greeting']
export const fieldsObj1 = { greeting: 'greeting' } 
export const fieldsMapperObj1 = { greeting: 'greet' } 

export const testTableItemsWithFields1 = [
  { greeting: 'hello' },
]
export const testTableItemsWithFieldsObj1 = [
  { greeting: 'hello' },
]
export const testTableItemsWithFieldsMapperObj1 = [
  { greet: 'hello' },
]

export const fields2 = ['greeting', 'bar', 'd']
export const fieldsObj2 = { greeting: 'greeting', 'bar': 'baz', 'd': 'ddd' } 
export const fieldsMapperObj2 = { greeting: 'greet', 'bar': 'baz', 'd': 'ddd' } 

export const testTableItemsWithFields2 = [
  { greeting: 'hello', bar: 'bar', 'd': ['', '', 'D'] },
]
export const testTableItemsWithFieldsObj2 = [
  { greeting: 'hello' , 'baz': 'bar', 'ddd': ['', '', 'D'] },
]
export const testTableItemsWithFieldsMapperObj2 = [
  { greet: 'hello', 'baz': 'bar', 'ddd': ['', '', 'D'] },
]

