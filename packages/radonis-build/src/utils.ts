/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path/posix'

import type { BuildManifest } from '@microeinhundert/radonis-types'
import { outputFile } from 'fs-extra'

import {
  BUILD_MANIFEST_FILE_NAME,
  FLASH_MESSAGE_IDENTIFIER_REGEX,
  MESSAGE_IDENTIFIER_REGEX,
  ROUTE_IDENTIFIER_REGEX,
} from './constants'

/**
 * Read the build manifest from disk
 * @internal
 */
export async function readBuildManifestFromDisk(directory: string): Promise<BuildManifest | null> {
  try {
    const fileContents = await readFile(join(directory, BUILD_MANIFEST_FILE_NAME), 'utf-8')

    return JSON.parse(fileContents)
  } catch {
    return null
  }
}

/**
 * Write the build manifest to disk
 * @internal
 */
export async function writeBuildManifestToDisk(buildManifest: BuildManifest, directory: string): Promise<void> {
  await outputFile(join(directory, BUILD_MANIFEST_FILE_NAME), JSON.stringify(buildManifest, null, 2))
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
