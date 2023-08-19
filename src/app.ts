import express from 'express'
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
export default app
