import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

describe('createXMLData', () => {
  it('works correctly', () => {
    const content = createXMLData(testTableItems)

    expect(content).not.toContain('<!DOCTYPE')
    expect(content).toMatchSnapshot()
  })

  it('works with empty array', () => {
    expect(createXMLData([])).toMatchSnapshot()
  })

  it('uses a valid fallback for field names that normalize to an empty string', () => {
    const content = createXMLData({ '123': 'number', '!!!': 'punctuation' })

    expect(content).toContain('<element name="123">')
    expect(content).toContain('<element name="!!!">')
    expect(content).not.toContain('<>')
  })

  it('preserves and escapes field names that change during normalization', () => {
    const content = createXMLData({ 'hello world': 'space', 'say"hi': 'quote' })

    expect(content).toContain('<hello-world name="hello world">')
    expect(content).toContain('<sayhi name="say&quot;hi">')
  })

  it('reports the path of circular references', () => {
    const data: Record<string, unknown> = {}
    data.self = data

    expect(() => createXMLData(data)).toThrow('Circular reference found at $.self')
  })
})
