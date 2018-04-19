import { testTableItems } from './shared/data'
import { _createJSONData } from '../src/converters'

describe('_createJSONData', () => {

  it('convert plain object as the JSON.stringify does', () => {
    expect(_createJSONData(testTableItems, null, 0)).toMatchSnapshot()
  })

  it('handle toJSON correctly', () => {
    const toJSON1 = {
      foo: 42,
      toJSON: () => ({ foo: 24 }),
    }

    const parsedAs1 = { foo: 24 }

    const toJSON2 = {
      foo: 42,
      bar: {
        foo: 24,
        toJSON: () => 24,
      },
    }

    const parsedAs2 = { foo: 42, bar: 24 }

    expect(JSON.parse(_createJSONData(toJSON1, null, 0))).toEqual(parsedAs1)
    expect(JSON.parse(_createJSONData(toJSON2, null, 0))).toEqual(parsedAs2)
  })
})
