import { expect, test, describe } from 'vitest'
import saySomething from './wadap'

describe('wadap', () => {
  const something = 'a message'
  test('can say something', () => {
    expect(saySomething(something)).toEqual(`I am saying ${something}`)
  })
})
