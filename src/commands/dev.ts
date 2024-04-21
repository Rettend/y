import process from 'node:process'
import { deploy } from '../util/deploy'
import { permissions } from '../util/constants'
import type { Command } from './index'

export const off = {
  data: {
    name: 'off',
    description: 'Turn off the bot.',
    // @ts-expect-error types are wrong
    default_member_permissions: permissions.ADMINISTRATOR,
  },
  async execute(interaction) {
    const message = await interaction.reply({
      content: 'Shutting down...',
      ephemeral: true,
    })

    setTimeout(async () => {
      await message.delete()
      process.exit(0)
    }, 1000)
  },
} satisfies Command

export const reload = {
  data: {
    name: 'reload',
    description: 'Reloads all slash commands.',
    // @ts-expect-error types are wrong
    default_member_permissions: permissions.ADMINISTRATOR,
  },
  async execute(interaction) {
    const message = await interaction.reply({
      content: 'Reloading commands...',
      ephemeral: true,
    })

    setTimeout(async () => {
      await deploy()
      await message.delete()
    }, 1000)
  },
} satisfies Command
