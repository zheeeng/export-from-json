import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

describe('createXMLData', () => {
  it('works correctly', () => {
    expect(createXMLData(testTableItems)).toMatchSnapshot()
  })

  it('works with empty array', () => {
    expect(createXMLData([])).toMatchSnapshot()
  })
})
