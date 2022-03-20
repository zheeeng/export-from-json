import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

describe('createXLSData', () => {
  it('works correctly', () => {
    expect(createXLSData(testTableItems)).toMatchSnapshot()
  })

  it('works with empty array', () => {
    expect(createXLSData([])).toEqual('')
  })
})
