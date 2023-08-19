import express from 'express'
import saySomething from './wadap'

const PORT = 3000

const app = express()

app.get('/hello', (_req, res) => {
  return res.status(200).json(saySomething('hello'))
})
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
