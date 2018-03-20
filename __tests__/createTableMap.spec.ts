import { testTableItems, testTableMap as expectedTableMap } from './shared/data'
import { createTableMap } from '../src/converters'

describe('createTableMap', () => {
  const tableMap = createTableMap(testTableItems)

  it('works as expected', () => {
    expect(tableMap).toEqual(expectedTableMap)
  })

  it('works correctly', () => {
    expect(tableMap).toMatchSnapshot()
  })
})
