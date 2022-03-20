import { testTableMap, resultOfTestTableMap, sortedOfTestTableMap } from './shared/data'
import { _createTableEntries } from '../src/converters'

describe('_createTableEntries', () => {

  test('create field entries correctly', () => {
    expect(
      _createTableEntries(testTableMap)
    ).toEqual(resultOfTestTableMap)
  })

  test('sort field entries correctly', () => {
    expect(
      _createTableEntries(testTableMap, entries => entries.sort((p, c) => p.fieldName.localeCompare(c.fieldName)))
    ).toEqual(sortedOfTestTableMap)
  })
})
