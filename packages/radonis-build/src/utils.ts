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
import { join, parse } from 'path'

import type { BuildManifest } from './types'

/**
 * Strip the public dir from the beginning of a path
 */
export function stripPublicDir(path: string): string {
  return join('/', path.replace(/^public\//, ''))
}

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
  return fsReadAll(directory, (filePath) => isComponentFile(filePath)).reduce<Map<string, string>>((acc, filePath) => {
    const absoluteFilePath = join(directory, filePath)
    return acc.set(absoluteFilePath, readFileSync(absoluteFilePath, 'utf8'))
  }, new Map())
}

/**
 * Read the build manifest from disk
 */
export async function readBuildManifestFromDisk(directory: string): Promise<BuildManifest> {
  try {
    const fileContents = await readFile(join(directory, 'build-manifest.json'), 'utf-8')
    return JSON.parse(fileContents)
  } catch {
    return {}
  }
}
