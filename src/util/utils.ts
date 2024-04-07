/* eslint-disable no-console */
import process from 'node:process'
import type OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import type { TextBasedChannel, User } from 'discord.js'
import { MAX_MESSAGES, MESSAGE_SIZE_LIMIT } from './constants'

export function log(prefix: string, message: string) {
  console.log(`[${prefix}] ${message}`)
}

export function r(path: string) {
  return new URL(`../${path}`, import.meta.url)
}

export function chunkate(message: string | null) {
  return message?.match(new RegExp(`.{1,${MESSAGE_SIZE_LIMIT}}`, 'gs'))
}

export async function chat(bot: User, channel: TextBasedChannel | null, openai: OpenAI) {
  if (!channel)
    return

  const messages = await channel.messages.fetch({ limit: MAX_MESSAGES })

  const messagesArray: ChatCompletionMessageParam[] = messages.reverse().map(m => ({
    role: bot.id === m.author.id ? 'assistant' : 'user',
    content: m.content,
    name: m.author.username,
  }))

  console.log(messagesArray)

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: process.env.SYSTEM_PROMPT ?? 'You are Lenard, a regular Discord user. You talk casually, use emojis, and don\'t use capital letters. You talk in internet shorthand like np, lol, xd, idk and nvm. You have many interests and love talking to people.' },
      ...messagesArray,
    ],
    presence_penalty: 0.5,
    temperature: 1.5,
    model: 'gpt-4-turbo-preview',
    // model: 'gpt-3.5-turbo',
  })

  const response = completion.choices[0].message.content
  const chunks = chunkate(response)

  if (!response || !chunks)
    throw new Error('No response')

  for (const chunk of chunks)
    await channel.send(chunk)
}
