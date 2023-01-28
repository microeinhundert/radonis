/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/poppinss/utils
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Filter to remove dot files
 */
function filterDotFiles(fileName: string) {
  return fileName[0] !== '.'
}

/**
 * Read all files from the directory recursively
 */
async function readFiles(root: string, files: string[], relativePath: string): Promise<void> {
  const location = join(root, relativePath)
  const stats = await stat(location)

  if (stats.isDirectory()) {
    let locationFiles = await readdir(location)

    await Promise.all(
      locationFiles.filter(filterDotFiles).map((file) => {
        return readFiles(root, files, join(relativePath, file))
      })
    )

    return
  }

  files.push(location)
}

/**
 * Get an array of file paths from the given location
 */
export async function fsReadAll(
  location: URL | string,
  options?: { filter?: (filePath: string, index: number) => boolean }
): Promise<string[]> {
  const normalizedLocation = typeof location === 'string' ? location : fileURLToPath(location)

  const files: string[] = []

  await stat(normalizedLocation)
  await readFiles(normalizedLocation, files, '')

  if (options?.filter) {
    return files.filter(options.filter)
  }

  return files
}
