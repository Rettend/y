import { ApplicationCommandOptionType, ChannelType } from 'discord.js'
import { createOptions, extractOptions } from '../util/utils'
import { permissions } from '../util/constants'
import type { Command } from './index'

const options = createOptions(
  {
    name: 'amount',
    type: ApplicationCommandOptionType.Integer,
    description: 'The amount of messages to clear.',
  },
)

export default {
  data: {
    name: 'clear',
    description: 'Clears a specified amount of messages from the channel.',
    default_member_permissions: permissions.ADMINISTRATOR,
    options,
  },
  async execute(interaction) {
    const { amount = 1 } = extractOptions(interaction.options.data, options)

    if (amount < 1 || amount > 100)
      await interaction.reply('The amount must be between 1 and 100.')

    if (interaction.channel?.type === ChannelType.GuildText) {
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
