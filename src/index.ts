import prodServer from './prodServer'

const PORT = 3001

prodServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
