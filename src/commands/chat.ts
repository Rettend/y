import OpenAI from 'openai'
import { ApplicationCommandOptionType } from 'discord.js'
import { chat, createOptions, extractOptions } from '../util/utils'
import type { Command } from './index'

const openai = new OpenAI()

const options = createOptions(
  {
    name: 'temperature' as const,
    type: ApplicationCommandOptionType.Number,
    description: 'The temperature for the model response',
  },
  {
    name: 'limit' as const,
    type: ApplicationCommandOptionType.Integer,
    description: 'The amount of messages to fetch',
  },
  {
    name: 'prompt' as const,
    type: ApplicationCommandOptionType.String,
    description: 'The message to prompt the bot with',
  },
)

export default {
  data: {
    name: 'chat',
    description: 'Prompts the bot to answer',
    options,
  },
  async execute(interaction) {
    const { temperature, limit, prompt } = extractOptions(interaction.options.data, options)

    await interaction.deferReply()

    await chat({
      bot: interaction.client.user,
      user: interaction.user,
      channel: interaction.channel,
    }, openai, temperature, limit, prompt)

    await interaction.editReply('^^')
    await interaction.deleteReply()
  },
} satisfies Command
