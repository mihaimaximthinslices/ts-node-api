// run these in github actions

import request from 'supertest'
import app from '../src/prodServer'

import { describe, it, expect } from 'vitest'

describe('API', () => {
  it('should get the current time by calling /time', async () => {
    const resp = await request(app).get('/time')
    expect(resp.status).toEqual(200)
    const json = JSON.parse(resp.text)
    expect(json.currentTime.split(',')[0]).toEqual(`The time is ${new Date().toLocaleString().split(',')[0]}`)
  })

  it('should say something by calling /hello', async () => {
    const resp = await request(app).get('/hello')
    expect(resp.status).toEqual(200)
    const json = JSON.parse(resp.text)
    expect(json.message).toEqual('I am saying hello')
  })
})
