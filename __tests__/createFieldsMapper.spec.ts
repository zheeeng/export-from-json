import {
  testTableItems,
  fields1, testTableItemsWithFields1,
  fieldsMapperObj1, testTableItemsWithFieldsMapperObj1,
  fields2, testTableItemsWithFields2,
  fieldsMapperObj2, testTableItemsWithFieldsMapperObj2,
} from './shared/data'
import { _createFieldsMapper } from '../src/converters'

describe('_createFieldsMapper', () => {

  test('mapper return the original items', () => {
    const fieldsMapper = _createFieldsMapper()

    const cloned = JSON.parse(JSON.stringify(testTableItems))

    expect(fieldsMapper(testTableItems)).toEqual(cloned)
    expect(fieldsMapper(testTableItems)).toBe(testTableItems)
  })

  test('mapper omit fields correctly 1', () => {
    const fieldsMapper = _createFieldsMapper(fields1)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFields1)
  })

  test('mapper omit fields correctly 2', () => {
    const fieldsMapper = _createFieldsMapper(fieldsMapperObj1)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFieldsMapperObj1)
  })

  test('mapper omit fields correctly 3', () => {
    const fieldsMapper = _createFieldsMapper(fields2)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFields2)
  })

  test('mapper omit fields correctly 4', () => {
    const fieldsMapper = _createFieldsMapper(fieldsMapperObj2)

    expect(fieldsMapper(testTableItems)).toEqual(testTableItemsWithFieldsMapperObj2)
  })
})
