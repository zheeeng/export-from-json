import exportFromJSON from '../src/exportFromJSON'

const tsv = 'tsv' as const

describe('exportFromJSON TSV export', () => {
  it('exposes TSV through the mounted export types', () => {
    expect(exportFromJSON.types.tsv).toBe('tsv')
  })

  it('exports tab-separated data and passes TSV metadata to the processor', () => {
    const processor = jest.fn((content: string) => content)

    expect(exportFromJSON({
      data: [{ name: 'Ada', age: 36 }],
      fileName: 'people',
      exportType: tsv,
      processor,
    })).toEqual('name\tage\r\nAda\t36')
    expect(processor).toHaveBeenCalledWith('name\tage\r\nAda\t36', tsv, 'people.tsv')
  })

  it('uses a fixed tab delimiter even when the CSV delimiter option is provided', () => {
    expect(exportFromJSON({
      data: [{ name: 'Ada', age: 36 }],
      exportType: tsv,
      delimiter: ';',
      processor: content => content,
    })).toEqual('name\tage\r\nAda\t36')
  })

  it('supports JSON strings, field mapping, BOM, and formula escaping', () => {
    expect(exportFromJSON({
      data: '[{"name":"Ada","formula":"=1+1"}]',
      fields: { name: 'person', formula: 'result' },
      exportType: tsv,
      withBOM: true,
      escapeFormulae: true,
      processor: content => content,
    })).toEqual("\ufeffperson\tresult\r\nAda\t'=1+1")
  })

  it('quotes values containing tabs using the shared table encoding extension', () => {
    expect(exportFromJSON({
      data: [{ note: 'left\tright' }],
      exportType: tsv,
      processor: content => content,
    })).toEqual('note\r\n"left\tright"')
  })
})
