import exportFromJSON from '../src/exportFromJSON'

const contentProcessor = (content: string) => content

describe('exportFromJSON JSON string input', () => {
  it('parses a JSON string for JSON export', () => {
    expect(exportFromJSON({
      data: '{"name":"Ada"}',
      exportType: 'json',
      processor: contentProcessor,
    })).toEqual('{\n    "name": "Ada"\n}')
  })

  it('parses a JSON array string for CSV export', () => {
    expect(exportFromJSON({
      data: '[{"name":"Ada"}]',
      exportType: 'csv',
      processor: contentProcessor,
    })).toEqual('name\r\nAda')
  })

  it('rejects malformed JSON with the JSON validation error', () => {
    expect(() => exportFromJSON({
      data: '{',
      exportType: 'xml',
      processor: contentProcessor,
    })).toThrow('Invalid export data. Please provide a valid JSON')
  })
})

describe('exportFromJSON table validation', () => {
  it('rejects rows that are not objects', () => {
    expect(() => exportFromJSON({
      data: [null] as unknown as object[],
      exportType: 'csv',
      processor: contentProcessor,
    })).toThrow('Invalid export data. Please provide an array of objects')
  })
})
