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
})
