import type { PathLike } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { URL } from 'node:url'
import type { Command } from '../commands/index'
import { predicate as commandPredicate } from '../commands/index'
import type { Event } from '../events/index'
import { predicate as eventPredicate } from '../events/index'

/**
 * A predicate to check if the structure is valid
 */
export type StructurePredicate<T> = (structure: unknown) => structure is T

/**
 * Loads all the structures in the provided directory
 *
 * @param dir - The directory to load the structures from
 * @param predicate - The predicate to check if the structure is valid
 * @param recursive - Whether to recursively load the structures in the directory
 * @returns The loaded structures
 */
export async function loadStructures<T>(
  dir: PathLike,
  predicate: StructurePredicate<T>,
  recursive = true,
): Promise<T[]> {
  const statDir = await stat(dir)

  if (!statDir.isDirectory())
    throw new Error(`The directory '${dir}' is not a directory.`)

  const files = await readdir(dir)
  const structures: T[] = []

  for (const file of files) {
    if (file === 'index.ts' || !file.endsWith('.ts'))
      continue

    const statFile = await stat(new URL(`${dir}/${file}`))

    if (statFile.isDirectory() && recursive) {
      structures.push(...(await loadStructures(`${dir}/${file}`, predicate, recursive)))
      continue
    }

    const importedStructures = await import(`${dir}/${file}`)

    for (const structure of Object.values(importedStructures)) {
      if (predicate(structure))
        structures.push(structure)
    }
  }

  return structures
}

export async function loadCommands(dir: PathLike, recursive = true): Promise<Map<string, Command>> {
  return (await loadStructures(dir, commandPredicate, recursive)).reduce(
    (acc, cur) => acc.set(cur.data.name, cur),
    new Map<string, Command>(),
  )
}

export async function loadEvents(dir: PathLike, recursive = true): Promise<Event[]> {
  return loadStructures(dir, eventPredicate, recursive)
}
