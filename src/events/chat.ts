import process from 'node:process'
import OpenAI from 'openai'
import { Events } from 'discord.js'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { chunkate } from '../util/utils'
import { MAX_MESSAGES } from '../util/constants'
import type { Event } from './index'

const openai = new OpenAI()

export default {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot)
      return

    const messages = await message.channel.messages.fetch({ limit: MAX_MESSAGES })

    const messagesArray: ChatCompletionMessageParam[] = messages.reverse().map(m => ({
      role: message.author.id === m.author.id ? 'user' : 'assistant',
      content: m.content,
      name: m.author.username,
    }))

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: process.env.SYSTEM_PROMPT ?? 'You are Lenard, a regular Discord user. You talk casually, use emojis, and don\'t use capital letters. You talk in internet shorthand like np, lol, xd, idk and nvm. You have many interests and love talking to people.' },
        ...messagesArray,
      ],
      model: 'gpt-3.5-turbo',
    })

    const response = completion.choices[0].message.content
    const chunks = chunkate(response)

    if (!response || !chunks)
      throw new Error('No response')

    for (const chunk of chunks)
      await message.channel.send(chunk)
  },
} satisfies Event<Events.MessageCreate>
