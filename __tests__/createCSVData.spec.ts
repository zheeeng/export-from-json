import { testTableItems } from './shared/data'
import { createCSVData } from '../src/converters'

it('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems)).toMatchSnapshot()
})
