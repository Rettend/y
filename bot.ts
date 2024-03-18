import { deploy, load, SlashCommandOptionType, TextChannel } from "./deps.ts"

const env = await load()

deploy.init({
  // env: true,
  publicKey: env["PUBLIC_KEY"],
  token: env["TOKEN"],
})

const command = await deploy.commands.all()

if (command.size !== 2) {
  deploy.commands.bulkEdit([
    {
      name: "ping",
      description: "Replies with Pong!",
      options: [
        {
          name: "pingarg",
          description: "The argument to ping",
          type: SlashCommandOptionType.STRING,
        },
      ],
    },
    {
      name: "clear",
      description: "Deletes a specified amount of messages",
      options: [
        {
          name: "amount",
          description: "The amount of messages to delete",
          type: SlashCommandOptionType.NUMBER,
        },
      ],
    },
  ])

  console.log("✅ Commands updated")
}

deploy.handle("ping", (d) => {
  const arg = d.option<string | undefined>("pingarg")
  d.reply(`Pong! You typed: ${arg !== undefined ? arg : "nothing"}`)
})

deploy.handle("clear", async (d) => {
  const amount = d.option<number>("amount")

  if (!(d.channel instanceof TextChannel)) return

  const messages = await d.channel.fetchMessages({ limit: amount })

  messages.forEach(async (message) => {
    await message.delete()
  })
})


deploy.client.on("ping", () => {
  console.log("Bot is ready!")
})

