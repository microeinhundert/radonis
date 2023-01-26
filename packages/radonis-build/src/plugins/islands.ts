/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dirname } from 'node:path'

import { AssetType } from '@microeinhundert/radonis-types'
import type { Plugin } from 'esbuild'
import { readFile } from 'fs-extra'

import { ISLAND_REGEX } from '../constants'
import { getLoaderForFile } from '../loaders'

/**
 * @internal
 */
export const islandsPlugin = (): Plugin => ({
  name: 'radonis-islands',
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
      return { path, namespace: AssetType.IslandScript }
    })

    onLoad({ filter: /.*/, namespace: AssetType.IslandScript }, async ({ path }) => {
      let contents = await readFile(path, 'utf8')

      const matches = contents.matchAll(ISLAND_REGEX)
      const islands = new Set<string>()

      for (const match of matches) {
        if (match?.groups?.identifier && match?.groups?.symbol) {
          const identifier = match.groups.identifier.trim()
          const symbol = match.groups.symbol.trim()

          islands.add(identifier)

          contents = contents.replace(match[0], `hydrateIsland('${identifier}', ${symbol})`)
        }
      }

      contents = ["import { hydrateIsland } from '@microeinhundert/radonis';", contents].join('\n')

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
        pluginData: {
          islands: Array.from(islands),
          originalPath: path,
        },
      }
    })
  },
})
