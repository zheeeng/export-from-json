import { testTableItems } from './shared/data'
import { createXLSData } from '../src/exportFromJSON'

it('createCSVData works correctly', () => {
  expect(createXLSData(testTableItems)).toMatchSnapshot()
})
