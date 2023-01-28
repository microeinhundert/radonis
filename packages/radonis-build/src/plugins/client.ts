/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { AssetType } from '@microeinhundert/radonis-types'
import type { Plugin } from 'esbuild'

import { getLoaderForFile } from '../loaders'

/**
 * @internal
 */
export function clientPlugin(): Plugin {
  return {
    name: 'radonis-client',
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.client\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
        return { path, namespace: AssetType.ClientScript }
      })

      onLoad({ filter: /.*/, namespace: AssetType.ClientScript }, async ({ path }) => {
        const contents = await readFile(path, { encoding: 'utf-8' })

        return {
          contents,
          resolveDir: dirname(path),
          loader: getLoaderForFile(path),
        }
      })
    },
  }
}
