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

import { ASSETS_MANIFEST_FILE_NAME, TOKEN_REGEX } from './constants'

/**
 * Get the entry points for the given location
 */
export async function getEntryPoints(location: string) {
  return fsReadAll(location, {
    filter: (filePath) => {
      return /\.(client|island)\.(ts(x)?|js(x)?)$/.test(filePath)
    },
  })
}

/**
 * Read the assets manifest from disk
 */
export async function readAssetsManifestFromDisk(location: string) {
  try {
    const fileContents = await readFile(join(location, ASSETS_MANIFEST_FILE_NAME), 'utf-8')

    return JSON.parse(fileContents) as AssetsManifest
  } catch {
    return null
  }
}

/**
 * Write the assets manifest to disk
 */
export async function writeAssetsManifestToDisk(assetsManifest: AssetsManifest, location: string) {
  await ensureDirExists(location)
  await writeFile(join(location, ASSETS_MANIFEST_FILE_NAME), JSON.stringify(assetsManifest, null, 2))
}

/**
 * Extract tokens from a haystack
 */
export function extractTokens(haystack: string) {
  const matches = haystack.matchAll(TOKEN_REGEX)
  const tokens = new Set<string>()

  for (const match of matches) {
    if (match?.groups?.identifier) {
      tokens.add(match.groups.identifier)
    }
  }

  return Array.from(tokens)
}

/**
 * Check if a string is a valid asset type
 */
export function isAssetType(value: string): value is AssetType {
  return Object.values<string>(AssetType).includes(value)
}

/**
 * Get the meta information for a given output
 */
export function getOutputMeta(output: { entryPoint?: string }) {
  let [type, originalPath] = output.entryPoint?.split(/:(.*)/s) ?? []

  type ||= AssetType.ChunkScript

  if (!isAssetType(type)) {
    throw new Error(`Invalid asset type "${type}" for entry "${output.entryPoint}"`)
  }

  return {
    type,
    originalPath,
  }
}
