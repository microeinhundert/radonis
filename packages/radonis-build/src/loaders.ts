/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { extname } from 'node:path'

import type { Loader } from 'esbuild'

import { E_CANNOT_GET_FILE_LOADER } from './exceptions/cannot_get_file_loader'

export const loaders: Record<string, Loader> = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

export function getLoaderForFile(fileNameOrPath: string): Loader {
  const ext = extname(fileNameOrPath)

  if (!(ext in loaders)) {
    throw new E_CANNOT_GET_FILE_LOADER([fileNameOrPath])
  }

  return loaders[ext]
}
