import {
  testTableItems,
  fields1, testTableItemsWithFields1,
  fieldsMapperObj1, testTableItemsWithFieldsMapperObj1,
  fields2, testTableItemsWithFields2,
  fieldsMapperObj2, testTableItemsWithFieldsMapperObj2,
} from './shared/data'
import { _createFieldsMapper } from '../src/converters'

describe('_createFieldsMapper', () => {

  test('the mapper returns the original items', () => {
    const fieldsMapper = _createFieldsMapper()

    const cloned = JSON.parse(JSON.stringify(testTableItems))

    expect(fieldsMapper(testTableItems)).toEqual(cloned)
    expect(fieldsMapper(testTableItems)).toBe(testTableItems)
  })

  test('the mapper omits fields correctly 1', () => {
    const fieldsMapper = _createFieldsMapper(fields1)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFields1)
  })

  test('the mapper omits fields correctly 2', () => {
    const fieldsMapper = _createFieldsMapper(fieldsMapperObj1)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFieldsMapperObj1)
  })

  test('the mapper omits fields correctly 3', () => {
    const fieldsMapper = _createFieldsMapper(fields2)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFields2)
  })

  test('the mapper omits fields correctly 4', () => {
    const fieldsMapper = _createFieldsMapper(fieldsMapperObj2)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFieldsMapperObj2)
  })

  test('preserves requested field order', () => {
    const fieldsMapper = _createFieldsMapper(['second', 'first'])
    const [result] = fieldsMapper([{ first: 1, second: 2 }]) as Array<Record<string, unknown>>

    expect(Object.keys(result)).toEqual(['second', 'first'])
  })

  test('preserves rows that do not contain selected fields', () => {
    const fieldsMapper = _createFieldsMapper(['selected'])

    expect(fieldsMapper([{ selected: 1 }, { other: 2 }]))
      .toEqual([{ selected: 1 }, { selected: undefined }])
  })

  test('materializes selected fields even when every row is missing them', () => {
    const fieldsMapper = _createFieldsMapper(['selected'])
    const result = fieldsMapper([{ other: 1 }, { other: 2 }]) as Array<Record<string, unknown>>

    expect(result).toHaveLength(2)
    expect(result.every(row => Object.prototype.hasOwnProperty.call(row, 'selected'))).toBe(true)
    expect(result.map(row => row.selected)).toEqual([undefined, undefined])
  })

  test('rejects duplicate output field aliases', () => {
    expect(() => _createFieldsMapper({ first: 'duplicate', second: 'duplicate' }))
      .toThrow('Field aliases must be unique')
    expect(() => _createFieldsMapper(['duplicate', 'duplicate']))
      .toThrow('Field aliases must be unique')
  })

  test('does not select keys inherited by the mapper object', () => {
    const fieldsMapper = _createFieldsMapper({ selected: 'selected' })
    const row = Object.create(null) as Record<string, unknown>
    Object.defineProperty(row, 'toString', { enumerable: true, value: 'not selected' })

    expect(fieldsMapper([row])).toEqual([{ selected: undefined }])
  })
})
