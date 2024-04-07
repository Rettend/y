import OpenAI from 'openai'
import { Events } from 'discord.js'
import { chat } from '../util/utils'
import type { Event } from './index'

const openai = new OpenAI()

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot)
      return

    await chat(message.client.user, message.channel, openai)
  },
} satisfies Event<Events.MessageCreate>
