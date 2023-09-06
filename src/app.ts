import express from 'express'
import { getCurrentTimeMessage, saySomething } from './wadap'
import { makeHandler } from './main/api/factories'

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

app.get('/posts', makeHandler('getPostsHandler'))

export default app
