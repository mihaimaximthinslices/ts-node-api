import { RequestHandlerFactory } from './factories/handlers'
import express, { Express } from 'express'
import { getCurrentTimeMessage, saySomething } from '../../wadap'

type Params = {
  server: Express
  requestHandlerFactory: RequestHandlerFactory
}
export const setupServer = (params: Params) => {
  const { server, requestHandlerFactory } = params

  server.use(express.json())

  server.get('/hello', (_req, res) => {
    return res.status(200).json({
      message: saySomething('hello'),
    })
  })

  server.get('/time', (_req, res) => {
    return res.status(200).json({
      currentTime: getCurrentTimeMessage(() => new Date()),
    })
  })

  server.post('/login', requestHandlerFactory.make('loginHandler'))

  server.post('/register', requestHandlerFactory.make('postUserHandler'))

  server.post('/logout', requestHandlerFactory.make('logoutHandler'))

  server.get('/posts', requestHandlerFactory.make('getPostsHandler'))
}
