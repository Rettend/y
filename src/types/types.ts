import type {
  ApplicationCommandOptionType,
  ApplicationCommandSubCommand,
  ApplicationCommandSubGroup,
  Attachment,
  Channel,
  Role,
  User,
} from 'discord.js'

export type Mentionable = User | Channel | Role

export interface ApplicationCommandOptionTypeMap {
  [ApplicationCommandOptionType.Subcommand]: ApplicationCommandSubCommand
  [ApplicationCommandOptionType.SubcommandGroup]: ApplicationCommandSubGroup
  [ApplicationCommandOptionType.String]: string
  [ApplicationCommandOptionType.Integer]: number
  [ApplicationCommandOptionType.Boolean]: boolean
  [ApplicationCommandOptionType.User]: User
  [ApplicationCommandOptionType.Channel]: Channel
  [ApplicationCommandOptionType.Role]: Role
  [ApplicationCommandOptionType.Mentionable]: Mentionable
  [ApplicationCommandOptionType.Number]: number
  [ApplicationCommandOptionType.Attachment]: Attachment
}

// NOTE #1: this should work but TypeScript said no
// it only removes the undefined type if all options are required

// NOTE #2: if you have options with different types, you need to use `as const` on the `name` property

export type OptionTypeMap<T extends { name: string, type: ApplicationCommandOptionType, required?: boolean }[]> = {
  [K in T[number]['name']]: T[number]['required'] extends true
    ? ApplicationCommandOptionTypeMap[Extract<T[number], { name: K }>['type']]
    : ApplicationCommandOptionTypeMap[Extract<T[number], { name: K }>['type']] | undefined
}
