/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ensureDirExists, fsReadAll } from '@microeinhundert/radonis-shared/node'
import type { AssetsManifest } from '@microeinhundert/radonis-types'
import { AssetType } from '@microeinhundert/radonis-types'

import {
  ASSETS_MANIFEST_FILE_NAME,
  FLASH_MESSAGE_IDENTIFIER_REGEX,
  MESSAGE_IDENTIFIER_REGEX,
  ROUTE_IDENTIFIER_REGEX,
} from './constants'

/**
 * Get the entry points for the given path
 * @internal
 */
export async function getEntryPoints(path: string) {
  return fsReadAll(path, {
    filter: (filePath) => {
      return /\.(client|island)\.(ts(x)?|js(x)?)$/.test(filePath)
    },
  })
}

/**
 * Read the assets manifest from disk
 * @internal
 */
export async function readAssetsManifestFromDisk(directory: string): Promise<AssetsManifest | null> {
  try {
    const fileContents = await readFile(join(directory, ASSETS_MANIFEST_FILE_NAME), 'utf-8')

    return JSON.parse(fileContents)
  } catch {
    return null
  }
}

/**
 * Write the assets manifest to disk
 * @internal
 */
export async function writeAssetsManifestToDisk(assetsManifest: AssetsManifest, directory: string): Promise<void> {
  await ensureDirExists(directory)
  await writeFile(join(directory, ASSETS_MANIFEST_FILE_NAME), JSON.stringify(assetsManifest, null, 2))
}

/**
 * Extract identifiers from usage of `.has(Error)?` and `.get(Error)?`
 * @internal
 */
export function extractFlashMessages(haystack: string): string[] {
  const matches = haystack.matchAll(FLASH_MESSAGE_IDENTIFIER_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Extract identifiers from usage of `.formatMessage`
 * @internal
 */
export function extractMessages(haystack: string): string[] {
  const matches = haystack.matchAll(MESSAGE_IDENTIFIER_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Extract identifiers from usage of `.make` as well as specific component props
 * @internal
 */
export function extractRoutes(haystack: string): string[] {
  const matches = haystack.matchAll(ROUTE_IDENTIFIER_REGEX)
  const identifiers = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      identifiers.add(match.groups.identifier.trim())
    }
  }

  return Array.from(identifiers)
}

/**
 * Remove duplicates from an array
 * @internal
 */
export function dedupe<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * Removes nullish entries from an array
 * @internal
 */
export function nonNull<T>(array: (T | null)[]): T[] {
  return array.filter((entry): entry is T => entry !== null)
}

/**
 * Check if a string is a valid asset type
 * @internal
 */
export function isAssetType(value: string): value is AssetType {
  return Object.values<string>(AssetType).includes(value)
}

/**
 * Get the meta information for a given output
 * @internal
 */
export function getOutputMeta(output: { entryPoint?: string }) {
  let [type, originalPath] = output.entryPoint?.split(':') ?? []

  type ||= AssetType.ChunkScript

  if (!isAssetType(type)) {
    throw new Error(`Invalid asset type "${type}" for entry "${output.entryPoint}"`)
  }

  return {
    type,
    originalPath,
  }
}
