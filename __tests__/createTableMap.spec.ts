import { testTableItems, testTableMap as expectedTableMap } from './shared/data'
import { _createTableMap } from '../src/converters'

describe('_createTableMap', () => {
  const tableMap = _createTableMap(testTableItems)

  test('works as expected', () => {
    expect(tableMap).toEqual(expectedTableMap)
  })

  test('works correctly', () => {
    expect(tableMap).toMatchSnapshot()
  })
})
