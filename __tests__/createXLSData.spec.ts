import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

describe('createXLSData', () => {
  it('works correctly', () => {
    expect(createXLSData(testTableItems)).toMatchSnapshot()
  })

  it('works with empty array', () => {
    expect(createXLSData([])).toEqual('')
  })

  it('works with rows that have no fields', () => {
    expect(createXLSData([{}])).toEqual('')
  })

  it('escapes field names and values as HTML text', () => {
    const content = createXLSData([{ '<name>': '<script>alert("x")</script>' }])

    expect(content).toContain('&lt;name&gt;')
    expect(content).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(content).not.toContain('<script>')
  })
})
