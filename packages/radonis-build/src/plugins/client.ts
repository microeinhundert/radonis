/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dirname } from 'node:path'

import type { Plugin } from 'esbuild'
import { readFile } from 'fs-extra'

import { getLoaderForFile } from '../loaders'

/**
 * @internal
 */
export const clientPlugin = (): Plugin => ({
  name: 'radonis-client',
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /\.client\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
      return { path, namespace: 'radonis-client-script' }
    })

    onLoad({ filter: /.*/, namespace: 'radonis-client-script' }, async ({ path }) => {
      const contents = await readFile(path, 'utf8')

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
      }
    })
  },
})
