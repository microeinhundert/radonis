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

import { ISLAND_REGEX } from './constants'
import { getLoaderForFile } from './loaders'

export interface RadonisPluginOptions {
  onIslandFound(identifier: string, path: string): void
}

/**
 * The esbuild plugin responsible for extracting files which should be built for the client
 * @internal
 */
export const radonisPlugin = ({ onIslandFound }: RadonisPluginOptions): Plugin => ({
  name: 'radonis',
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /\.client\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
      return { path, namespace: 'client-script' }
    })
    onLoad({ filter: /.*/, namespace: 'client-script' }, async ({ path }) => {
      const contents = await readFile(path, 'utf8')

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
      }
    })

    onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
      return { path, namespace: 'island-script' }
    })
    onLoad({ filter: /.*/, namespace: 'island-script' }, async ({ path }) => {
      let contents = await readFile(path, 'utf8')
      const matches = contents.matchAll(ISLAND_REGEX)

      for (const match of matches) {
        if (match?.groups?.identifier && match?.groups?.symbol) {
          const identifier = match.groups.identifier.trim()
          const symbol = match.groups.symbol.trim()

          onIslandFound(identifier, path)

          contents = contents.replace(match[0], `hydrateIsland('${identifier}', ${symbol})`)
        }
      }

      contents = ["import { hydrateIsland } from '@microeinhundert/radonis';", contents].join('\n')

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
      }
    })
  },
})
