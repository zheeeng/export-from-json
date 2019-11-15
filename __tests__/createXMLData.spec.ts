import { testTableItems } from './shared/data'
import { createXMLData } from '../src/converters'

it('createXMLData works correctly', () => {
  expect(createXMLData(testTableItems, 'base')).toMatchSnapshot()
})