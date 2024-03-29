/* eslint-disable no-console */
export function log(prefix: string, message: string) {
  console.log(`[${prefix}] ${message}`)
}

export function r(path: string) {
  return new URL(`../${path}`, import.meta.url)
}
