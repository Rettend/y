import process from 'node:process'
import { URL } from 'node:url'
import { Client, GatewayIntentBits } from 'discord.js'
import { loadCommands, loadEvents } from './util/loaders'
import { registerEvents } from './util/registerEvents'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const events = await loadEvents(new URL('events/', import.meta.url))
const commands = await loadCommands(new URL('commands/', import.meta.url))

registerEvents(commands, events, client)

client.login(process.env.TOKEN)
