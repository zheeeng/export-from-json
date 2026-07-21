import { downloadFile, generateDataURI } from '../src/processors'

describe('generateDataURI', () => {
  test.each([
    ['txt', 'text/plain'],
    ['css', 'text/css'],
    ['html', 'text/html'],
    ['json', 'application/json'],
    ['csv', 'text/csv'],
    ['xls', 'application/vnd.ms-excel'],
    ['xml', 'application/xml'],
  ] as const)('creates a standards-compliant %s data URI', (type, mimeType) => {
    expect(generateDataURI('hello world', type, false))
      .toEqual(`data:${mimeType};charset=utf-8,hello%20world`)
  })
})

describe('downloadFile', () => {
  it('revokes the generated Blob URL after dispatching the download', () => {
    const anchor = {
      href: '',
      download: '',
      setAttribute: jest.fn(),
      dispatchEvent: jest.fn(),
    }
    const appendChild = jest.fn()
    const removeChild = jest.fn()
    const originalDocument = globalThis.document
    const originalWindow = globalThis.window
    const originalMouseEvent = globalThis.MouseEvent

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { createElement: jest.fn(() => anchor), body: { appendChild, removeChild } },
    })
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
    Object.defineProperty(globalThis, 'MouseEvent', {
      configurable: true,
      value: class MouseEvent {},
    })

    const createObjectURL = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeObjectURL = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    try {
      downloadFile('content', 'txt', 'report.txt')

      expect(anchor.href).toBe('blob:test')
      expect(anchor.download).toBe('report.txt')
      expect(anchor.dispatchEvent).toHaveBeenCalledTimes(1)
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:test')
    } finally {
      createObjectURL.mockRestore()
      revokeObjectURL.mockRestore()
      Object.defineProperty(globalThis, 'document', { configurable: true, value: originalDocument })
      Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow })
      Object.defineProperty(globalThis, 'MouseEvent', { configurable: true, value: originalMouseEvent })
    }
  })
})
