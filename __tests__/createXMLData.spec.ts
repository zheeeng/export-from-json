import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

test('createXMLData works correctly', () => {
  expect(createXMLData(testTableItems)).toMatchSnapshot()
})

test('createXMLData works with empty array', () => {
  expect(createXMLData([])).toMatchSnapshot()
})
