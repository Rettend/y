/* eslint-disable no-console */
import process from 'node:process'
import type OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { SnowflakeUtil } from 'discord.js'
import type { APIApplicationCommandOption, Collection, CommandInteractionOption, Message, TextBasedChannel, User } from 'discord.js'
import type { OptionTypeMap } from '../types/types'
import { MAX_MESSAGES, MESSAGE_SIZE_LIMIT } from './constants'

// #region General
export function log(prefix: string, message: string) {
  console.log(`[${prefix}] ${message}`)
}

export function r(path: string) {
  return new URL(`../${path}`, import.meta.url)
}
// #endregion

// #region Command options
export function createOptions<T extends APIApplicationCommandOption[]>(...options: T): T {
  return options
}

export function extractOptions<
  T extends APIApplicationCommandOption[],
>(optionsData: readonly CommandInteractionOption[], _options: T): OptionTypeMap<T> {
  const result: Partial<OptionTypeMap<T>> = {}

  for (const option of optionsData) {
    const { name, value } = option
    result[name as keyof OptionTypeMap<T>] = value as OptionTypeMap<T>[keyof OptionTypeMap<T>]
  }

  return result as OptionTypeMap<T>
}
// #endregion

// #region Chat
export function chunkate(message: string | null) {
  return message?.match(new RegExp(`.{1,${MESSAGE_SIZE_LIMIT}}`, 'gs'))
}

interface Options {
  channel: TextBasedChannel | null
  user: User
  bot: User
}

export async function getMessages({ bot, user, channel }: Options, limit?: number, prompt?: string) {
  if (!channel)
    throw new Error('Channel not found')

  let messages: Collection<string, Message> | undefined

  if (limit) {
    messages = await channel.messages.fetch({ limit: Math.min(limit, MAX_MESSAGES) })
  }
  else if (!prompt) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const after = SnowflakeUtil.generate({ timestamp: today.getTime() }).toString()

    messages = await channel.messages.fetch({ after })
  }

  const messagesArray: ChatCompletionMessageParam[] = messages?.reverse().map(m => ({
    role: bot.id === m.author.id ? 'assistant' : 'user',
    content: m.content,
    name: m.author.username,
  })) ?? []

  if (prompt) {
    messagesArray?.push({
      role: 'user',
      content: prompt,
      name: user.username,
    })
  }

  return messagesArray ?? []
}

export async function chat(options: Options, openai: OpenAI, temperature?: number, limit?: number, prompt?: string) {
  if (!options.channel)
    throw new Error('Channel not found')

  const messages = await getMessages(options, limit, prompt)
  console.log(messages)

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: process.env.SYSTEM_PROMPT ?? 'You are Lenard, a regular Discord user. You talk casually, use emojis, and don\'t use capital letters. You talk in internet shorthand like np, lol, xd, idk and nvm. You have many interests and love talking to people.' },
      ...messages,
    ],
    presence_penalty: 0.5,
    temperature: temperature ?? 1.3,
    model: 'gpt-4-turbo-preview',
    // model: 'gpt-3.5-turbo',
  })

  const response = completion.choices[0].message.content
  const chunks = chunkate(response)

  if (!response || !chunks)
    throw new Error('No response')

  for (const chunk of chunks)
    await options.channel.send(chunk)
}
// #endregion
