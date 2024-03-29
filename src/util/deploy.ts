import process from 'node:process'
import { URL } from 'node:url'
import { API } from '@discordjs/core'
import { REST } from 'discord.js'
import { log } from './utils'
import { loadCommands } from './loaders'

const commands = await loadCommands(new URL('../commands/', import.meta.url))
const commandData = [...commands.values()].map(command => command.data)

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)
const api = new API(rest)

const result = await api.applicationCommands.bulkOverwriteGlobalCommands(process.env.APPLICATION_ID!, commandData)

log('BOT', `Successfully registered ${result.length} commands.`)
