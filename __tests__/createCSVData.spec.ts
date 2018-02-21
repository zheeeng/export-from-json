import { testTableItems } from './shared/data'
import { createCSVData } from '../src/exportFromJSON'

it('createCSVData works correctly', () => {
  expect(createCSVData(testTableItems)).toMatchSnapshot()
})
