import process from 'node:process'
import { URL } from 'node:url'
import * as http from 'node:http'
import { Client, GatewayIntentBits } from 'discord.js'
import { loadCommands, loadEvents } from './src/util/loaders'
import { registerEvents } from './src/util/registerEvents'
import { log } from './src/util/utils'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

function r(path: string) {
  return new URL(`src/${path}`, import.meta.url)
}

const events = await loadEvents(r('events/'))
const commands = await loadCommands(r('commands/'))

registerEvents(commands, events, client)

client.login(process.env.DISCORD_TOKEN)

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(3000, '0.0.0.0', () => {
  log('SERVER', `Server running at http://0.0.0.0:3000/`)
})
