import OpenAI from 'openai'
import { chat } from '../util/utils'
import type { Command } from './index'

const openai = new OpenAI()

export default {
  data: {
    name: 'chat',
    description: 'Prompts the bot to answer',
  },
  async execute(interaction) {
    await chat(interaction.client.user, interaction.channel, openai)

    await interaction.reply('^^')
    await interaction.deleteReply()
  },
} satisfies Command
