// this is not needed just my stupid server panics if nothing is running on 3000

import * as http from 'node:http'
import { log } from './src/util/utils'

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

export function serve() {
  server.listen(3000, '0.0.0.0', () => {
    log('SERVER', `Server running at http://0.0.0.0:3000/`)
  })

  return server
}
