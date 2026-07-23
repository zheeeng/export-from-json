import { testTableMap, resultOfTestTableMap, sortedOfTestTableMap, beforeTableEncode2 } from './shared/data'
import { _createTableEntries } from '../src/converters'

describe('_createTableEntries', () => {

  it('creates field entries correctly', () => {
    expect(
      _createTableEntries(testTableMap)
    ).toEqual(resultOfTestTableMap)
  })

  it('sorts field entries correctly with the beforeTableEncode option customized', () => {
    expect(
      _createTableEntries(testTableMap, beforeTableEncode2)
    ).toEqual(sortedOfTestTableMap)
  })

  it('rejects columns with a different number of rows', () => {
    expect(() => _createTableEntries(testTableMap, entries => entries.map((entry, index) => ({
      ...entry,
      fieldValues: index === 0 ? entry.fieldValues.slice(1) : entry.fieldValues,
    })))).toThrow('Each table column must contain 3 values')
  })

  it('rejects duplicate field names returned by the callback', () => {
    expect(() => _createTableEntries(testTableMap, entries => entries.map(entry => ({
      ...entry,
      fieldName: 'duplicate',
    })))).toThrow('Table field names must be unique')
  })

  it('rejects malformed callback results', () => {
    expect(() => _createTableEntries(
      testTableMap,
      (() => null) as unknown as Parameters<typeof _createTableEntries>[1],
    )).toThrow('beforeTableEncode must return an array of table entries')
  })
})
