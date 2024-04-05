declare module 'bun' {
  interface Env {
    APPLICATION_ID: string | undefined
    DISCORD_TOKEN: string | undefined
    OPENAI_API_KEY: string | undefined
    SYSTEM_PROMPT: string | undefined
  }
}

export { }
