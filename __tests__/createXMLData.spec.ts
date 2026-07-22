import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

describe('createXMLData', () => {
  it('works correctly', () => {
    expect(createXMLData(testTableItems)).toMatchSnapshot()
  })

  it('works with empty array', () => {
    expect(createXMLData([])).toMatchSnapshot()
  })

  it('uses a valid fallback for field names that normalize to an empty string', () => {
    const content = createXMLData({ '123': 'number', '!!!': 'punctuation' })

    expect(content).toContain('<element>')
    expect(content).not.toContain('<>')
  })
})
