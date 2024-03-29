import process from 'node:process'
import { URL } from 'node:url'
import { Client, GatewayIntentBits } from 'discord.js'
import { loadCommands, loadEvents } from './src/util/loaders'
import { registerEvents } from './src/util/registerEvents'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

function r(path: string) {
  return new URL(`src/${path}`, import.meta.url)
}

const events = await loadEvents(r('events/'))
const commands = await loadCommands(r('commands/'))

registerEvents(commands, events, client)

client.login(process.env.TOKEN)
