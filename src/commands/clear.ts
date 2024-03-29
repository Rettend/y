import { ApplicationCommandOptionType, TextChannel } from 'discord.js'
import { permissions } from '../util/perm'
import type { Command } from './index'

export default {
  data: {
    name: 'clear',
    description: 'Clears a specified amount of messages from the channel.',
    default_member_permissions: permissions.ADMINISTRATOR,
    options: [
      {
        name: 'amount',
        description: 'The amount of messages to clear.',
        type: ApplicationCommandOptionType.Integer,
      },
    ],
  },
  async execute(interaction) {
    const amount = interaction.options.get('amount')?.value as number || 1

    if (amount < 1 || amount > 100)
      await interaction.reply('The amount must be between 1 and 100.')

    if (interaction.channel instanceof TextChannel) {
      const { size } = await interaction.channel.bulkDelete(amount)
      const message = await interaction.reply({
        content: `Deleted ${size} messages.`,
        ephemeral: true,
      })

      setTimeout(async () => await message.delete(), 3000)
    }
    else {
      await interaction.reply('This command can only be used in a text channel.')
    }
  },
} satisfies Command
