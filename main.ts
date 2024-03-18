import {
  Client,
  Intents,
  load,
  SlashCommandOptionType,
  TextChannel,
} from "./deps.ts"

const env = await load()
const client = new Client()

const TOKEN = env["TOKEN"]

if (!TOKEN) {
  console.log("No bot token found in .env")
  Deno.exit(1)
}

client.on("ready", () => {
  console.log("Ready!")
})

client.on("messageCreate", (message) => {
  if (message.author.bot) return
  console.log("content:", message.content.toString())

  if (message.content.startsWith("-ping")) {
    message.reply("Pong!")
    // } else if (message.content.startsWith("-clear")) {
    //   const amount = parseInt(message.content.split(" ")[1])
    //   if (isNaN(amount)) {
    //     message.reply("Please provide a number")
    //   } else {
    //     if (!(message.channel instanceof TextChannel)) return

    //     const messages = await message.channel.fetchMessages({ limit: amount })

    //     messages.forEach(async (message) => {
    //       await message.delete()
    //     })
    //   }
  } else {
    message.reply("hi ^^")
  }
})

// client.interactions.handle("ping", (d) => {
//   const arg = d.option<string | undefined>("pingarg")
//   d.reply(`Pong! You typed: ${arg !== undefined ? arg : "nothing"}`)
// })

// client.interactions.handle("clear", async (d) => {
//   const amount = d.option<number>("amount")

//   if (!(d.channel instanceof TextChannel)) return

//   const messages = await d.channel.fetchMessages({ limit: amount })

//   messages.forEach(async (message) => {
//     await message.delete()
//   })
// })

client.connect(TOKEN, Intents.None)
