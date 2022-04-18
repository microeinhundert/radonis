/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { fsReadAll } from '@poppinss/utils/build/helpers'
import { basename, join } from 'path'

/**
 * Check if the first character of a string is a lowercase letter
 */
export function isFirstCharLowerCase(string: string): boolean {
  return string.charAt(0).toLowerCase() === string.charAt(0)
}

/**
 * Discover all components in a specific directory
 */
export function discoverComponents(directory: string) {
  return fsReadAll(directory, (filePath) => {
    const fileName = basename(filePath)
    return fileName.endsWith('.tsx') && !fileName.endsWith('.server.tsx') && !isFirstCharLowerCase(fileName)
  }).map((path) => join(directory, path))
}
