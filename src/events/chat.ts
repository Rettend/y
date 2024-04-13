import OpenAI from 'openai'
import { ChannelType, Events } from 'discord.js'
import { chat } from '../util/utils'
import type { Event } from './index'

const openai = new OpenAI()

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot)
      return

    if (message.channel.type !== ChannelType.GuildText)
      return

    await chat({
      bot: message.client.user,
      user: message.author,
      channel: message.channel,
    }, openai)
  },
} satisfies Event<Events.MessageCreate>
