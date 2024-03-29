import process from 'node:process'
import { Client, GatewayIntentBits } from 'discord.js'
import { registerEvents } from './src/util/registerEvents'
import { loadCommands, loadEvents } from './src/util/loaders'
import { r } from './src/util/utils'
import { serve } from './server'

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
] })

const events = await loadEvents(r('events/'))
const commands = await loadCommands(r('commands/'))

registerEvents(commands, events, client)

client.login(process.env.DISCORD_TOKEN)

serve()
