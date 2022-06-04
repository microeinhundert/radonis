/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import type { Loader } from 'esbuild'
import { extname } from 'path'

export const loaders: Record<string, Loader> = {
  '.js': 'js',
  '.jsx': 'jsx',
  '.ts': 'ts',
  '.tsx': 'tsx',
}

export function getLoaderForFile(file: string): Loader {
  const ext = extname(file)

  invariant(ext in loaders, `Cannot get loader for file at "${file}"`)

  return loaders[ext]
}
