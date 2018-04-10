import { testTableItems } from './shared/data'
import { createJSONData } from '../src/converters'

describe('createJSONData', () => {

  it('convert plain object as the JSON.stringify does', () => {
    expect(createJSONData(testTableItems)).toMatchSnapshot()
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

    expect(JSON.parse(createJSONData(toJSON1))).toEqual(parsedAs1)
    expect(JSON.parse(createJSONData(toJSON2))).toEqual(parsedAs2)
  })
})
