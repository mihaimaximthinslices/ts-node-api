import express from 'express'
import { requestHandlerFactory } from './main/api/factories/handlers'
import { getCurrentTimeMessage, saySomething } from './wadap'

const app = express()

app.get('/hello', (_req, res) => {
  return res.status(200).json({
    message: saySomething('hello'),
  })
})

app.get('/time', (_req, res) => {
  return res.status(200).json({
    currentTime: getCurrentTimeMessage(() => new Date()),
  })
})

app.get('/posts', requestHandlerFactory.make('getPostsHandler'))

export default app
