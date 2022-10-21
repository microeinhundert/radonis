/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Loader } from 'esbuild'
import { extname } from 'path'

import { BuildException } from './exceptions/build_exception'

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
    throw BuildException.cannotGetFileLoader(fileNameOrPath)
  }

  return loaders[ext]
}
