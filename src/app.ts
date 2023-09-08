import express from 'express'
import { setupServer } from './main/api/server'
import { makeRequestHandlerFactory } from './main/api/factories/handlers'

const server = express()

setupServer({
  server,
  requestHandlerFactory: makeRequestHandlerFactory(),
})

export default server
