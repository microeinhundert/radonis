/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { AssetsManifest } from '@microeinhundert/radonis-types'
import { outputFile } from 'fs-extra'

import {
  ASSETS_MANIFEST_FILE_NAME,
  FLASH_MESSAGE_IDENTIFIER_REGEX,
  MESSAGE_IDENTIFIER_REGEX,
  ROUTE_IDENTIFIER_REGEX,
} from './constants'

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
  await outputFile(join(directory, ASSETS_MANIFEST_FILE_NAME), JSON.stringify(assetsManifest, null, 2))
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
