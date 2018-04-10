import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

it('createXLSData works correctly', () => {
  expect(createXLSData(testTableItems)).toMatchSnapshot()
})
