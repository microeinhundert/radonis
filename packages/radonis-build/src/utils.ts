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
import { join, parse } from 'path'

import type { BuildManifest } from './types'

/**
 * Check if the file looks like it contains a component:
 * - Starts with an uppercase letter
 * - Ends with `.ts(x)` or `.js(x)` extension
 * - Does not end with `.<something>.<ext>`
 */
export function isComponentFile(filePath: string): boolean {
  const { base } = parse(filePath)

  return base.match(/^[A-Z]\w+\.(ts(x)?|js(x)?)$/) !== null
}

/**
 * Discover all components in a specific directory
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
 */
export async function readBuildManifestFromDisk(directory: string): Promise<BuildManifest | null> {
  try {
    const fileContents = await readFile(join(directory, 'build-manifest.json'), 'utf-8')

    return JSON.parse(fileContents)
  } catch {
    return null
  }
}

/**
 * Write the build manifest to disk
 */
export function writeBuildManifestToDisk(buildManifest: BuildManifest, directory: string): void {
  outputFile(join(directory, 'build-manifest.json'), JSON.stringify(buildManifest, null, 2))
}
