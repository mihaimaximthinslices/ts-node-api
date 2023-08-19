import { expect, test, describe, vi } from 'vitest'
import { saySomething, getCurrentTimeMessage } from './wadap'

describe('wadap', () => {
  const something = 'a message'
  test('can say something', () => {
    expect(saySomething(something)).toEqual(`I am saying ${something}`)
  })

  const timeGetter = () => new Date()
  const NOW = timeGetter()
  const mockedTimeGetter = vi.fn(timeGetter).mockReturnValue(NOW)

  test('can get the current time', () => {
    expect(getCurrentTimeMessage(mockedTimeGetter)).toEqual(`The time is ${NOW.toLocaleString()}`)
  })
})
