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

export type OptionTypeMap<T extends { name: string, type: ApplicationCommandOptionType }[]> = {
  [K in T[number]['name']]: ApplicationCommandOptionTypeMap[Extract<T[number], { name: K }>['type']];
}
