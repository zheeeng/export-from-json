import exportFromJSON from '../src/exportFromJSON'
import { runInNewContext } from 'node:vm'

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

  it('accepts plain object rows created in another realm', () => {
    const row = runInNewContext('({ name: "Ada" })') as Record<string, unknown>

    expect(exportFromJSON({
      data: [row],
      exportType: 'csv',
      processor: contentProcessor,
    })).toEqual('name\r\nAda')
  })

  it('rejects class instances', () => {
    class Row {
      name = 'Ada'
    }

    expect(() => exportFromJSON({
      data: [new Row()],
      exportType: 'csv',
      processor: contentProcessor,
    })).toThrow('Invalid export data. Please provide an array of objects')
  })
})

describe('exportFromJSON CSV formula escaping', () => {
  it('passes the escapeFormulae option to the CSV converter', () => {
    const options = {
      data: [{ value: '=1+1' }],
      exportType: 'csv' as const,
      processor: contentProcessor,
    }

    expect(exportFromJSON({ ...options, escapeFormulae: false }))
      .toEqual('value\r\n=1+1')
    expect(exportFromJSON({ ...options, escapeFormulae: true }))
      .toEqual("value\r\n'=1+1")
  })
})
