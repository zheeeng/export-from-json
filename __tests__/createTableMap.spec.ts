import { testTableItems, testTableMap as expectedTableMap } from './shared/data'
import { _createTableMap } from '../src/converters'

describe('_createTableMap', () => {
  const tableMap = _createTableMap(testTableItems)

  it('works as expected', () => {
    expect(tableMap).toEqual(expectedTableMap)
  })

  it('works correctly', () => {
    expect(tableMap).toMatchSnapshot()
  })
})
