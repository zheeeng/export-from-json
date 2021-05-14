import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

it('createXMLData works correctly', () => {
  expect(createXMLData(testTableItems)).toMatchSnapshot()
})

it('createXMLData works with empty array', () => {
  expect(createXMLData([])).toMatchSnapshot()
})
