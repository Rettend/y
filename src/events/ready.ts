import { Events } from 'discord.js'
import { log } from '../util/utils'
import type { Event } from './index'

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    log('BOT', `Ready! Logged in as ${client.user.tag}`)
  },
} satisfies Event<Events.ClientReady>
