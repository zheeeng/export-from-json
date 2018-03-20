import { testTableItems } from './shared/data'
import { createXLSData } from '../src/converters'

it('createCSVData works correctly', () => {
  expect(createXLSData(testTableItems)).toMatchSnapshot()
})
