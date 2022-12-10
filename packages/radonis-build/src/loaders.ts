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

import { CannotGetFileLoaderException } from './exceptions/cannot_get_file_loader'

/**
 * @internal
 */
export const loaders: Record<string, Loader> = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

/**
 * @internal
 */
export function getLoaderForFile(fileNameOrPath: string): Loader {
  const ext = extname(fileNameOrPath)

  if (!(ext in loaders)) {
    throw new CannotGetFileLoaderException(fileNameOrPath)
  }

  return loaders[ext]
}
