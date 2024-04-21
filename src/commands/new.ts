import { DELIMITER } from '../util/constants'
import type { Command } from './index'

export default {
  data: {
    name: 'new',
    description: 'Delimiter for a new chat',
  },
  async execute(interaction) {
    await interaction.channel?.send(DELIMITER)

    await interaction.reply('^^')
    await interaction.deleteReply()
  },
} satisfies Command
