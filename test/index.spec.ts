import { load } from 'webfontloader'
import { Application } from '../src/engine/Application'
import '../src/'

jest.mock('webfontloader')
jest.mock('../src/engine/Application')

beforeEach(() => {
  // @ts-ignore
  load.mockClear()
  // @ts-ignore
  Application.mockClear()
})

it('fonts are loaded', () => {
  expect(load).toHaveBeenCalledTimes(1)
})
