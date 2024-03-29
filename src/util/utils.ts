/* eslint-disable no-console */
import { MESSAGE_SIZE_LIMIT } from './constants'

export function log(prefix: string, message: string) {
  console.log(`[${prefix}] ${message}`)
}

export function r(path: string) {
  return new URL(`../${path}`, import.meta.url)
}

export function chunkate(message: string | null) {
  return message?.match(new RegExp(`.{1,${MESSAGE_SIZE_LIMIT}}`, 'gs'))
}
