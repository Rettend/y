import process from 'node:process'
import { permissions } from '../util/perm'
import type { Command } from './index'

export default {
  data: {
    name: 'off',
    description: 'Turn off the bot.',
    default_member_permissions: permissions.ADMINISTRATOR,
  },
  async execute(interaction) {
    const message = await interaction.reply({
      content: 'Shutting down...',
      ephemeral: true,
    })

    setTimeout(async () => await message.delete(), 1000)

    process.exit(0)
  },
} satisfies Command
