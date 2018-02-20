import { RawData, createTableMap } from '../src/index'

describe('table map is valid', () => {
  const tableItems: RawData = [{ key: 'hello', value: 42 }, { foo: 'foo' }, { bar: 'bar' }]
  const tableMap = createTableMap(tableItems)

  test('is plain object', () => {
    expect(tableMap).toEqual(expect.any(Object))
  })

  test('the table keys collect all keys of each table item', () => {
    const expectedTableKeys = tableItems.map(Object.keys).reduce((acc, curr) => acc.concat(curr), [])

    expect(Object.keys(tableMap)).toEqual(expectedTableKeys)
  })

  test('all values are array type', () => {
    Object.values(tableMap).forEach(tableMapValue => {
      expect(tableMapValue).toEqual(expect.any(Array))
    })
  })

  test('all values have the same length with the number of table items', () => {
    const expectedLength = tableItems.length

    Object.values(tableMap).forEach(tableMapValue => {
      expect(tableMapValue).toHaveLength(expectedLength)
    })
  })
})
