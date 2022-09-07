/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fsReadAll } from '@poppinss/utils/build/helpers'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { outputFile } from 'fs-extra'
import { join, parse, posix, sep } from 'path'

import { BUILD_MANIFEST_FILE_NAME } from './constants'
import type { BuildManifest } from './types'

/**
 * Check if the file looks like it contains a component:
 * - Starts with an uppercase letter
 * - Ends with `.ts(x)` or `.js(x)` extension
 * - Does not end with `.<something>.<ext>`
 * @internal
 */
export function isComponentFile(filePath: string): boolean {
  const { base } = parse(filePath)

  return base.match(/^[A-Z]\w+\.(ts(x)?|js(x)?)$/) !== null
}

/**
 * Discover all components in a specific directory
 * @internal
 */
export function discoverComponents(directory: string): Map<string, string> {
  return fsReadAll(directory, (filePath) => isComponentFile(filePath)).reduce<Map<string, string>>(
    (components, componentPath) => {
      const absoluteComponentPath = join(directory, componentPath)
      return components.set(absoluteComponentPath, readFileSync(absoluteComponentPath, 'utf8'))
    },
    new Map<string, string>()
  )
}

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
 * Convert a file path to a file URL
 * @internal
 */
export function filePathToFileUrl(path: string): string {
  return path.split(sep).filter(Boolean).join(posix.sep)
}
