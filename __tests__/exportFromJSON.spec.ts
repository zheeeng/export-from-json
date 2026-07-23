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

describe('exportFromJSON JSON primitive input', () => {
  it.each([42, true, null])('rejects direct primitive value %p', data => {
    expect(() => exportFromJSON({
      data: data as unknown as object,
      exportType: 'json',
      processor: contentProcessor,
    })).toThrow('Invalid export data. Please provide a valid JSON')
  })
})

describe('exportFromJSON conversion pipeline', () => {
  it('does not serialize an entire table before CSV encoding', () => {
    const toJSON = jest.fn(() => 'serialized')

    expect(exportFromJSON({
      data: [{ value: { toJSON } }],
      exportType: 'csv',
      processor: contentProcessor,
    })).toEqual('value\r\n"""serialized"""')
    expect(toJSON).toHaveBeenCalledTimes(1)
  })

  it('normalizes every whitespace run in the default filename', () => {
    expect(exportFromJSON({
      data: 'content',
      fileName: 'quarterly sales report',
      exportType: 'txt',
      processor: (_content, _type, fileName) => fileName,
    })).toEqual('quarterly_sales_report.txt')
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

describe('exportFromJSON field schemas', () => {
  it('keeps selected columns when all rows are missing the field', () => {
    expect(exportFromJSON({
      data: [{ other: 1 }, { other: 2 }],
      fields: ['selected'],
      exportType: 'csv',
      processor: contentProcessor,
    })).toEqual('selected\r\n\r\n')
  })
})
