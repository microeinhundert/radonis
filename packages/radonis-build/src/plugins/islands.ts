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

import { ISLAND_REGEX } from '../constants'
import { getLoaderForFile } from '../loaders'

/**
 * @internal
 */
export function islandsPlugin(): Plugin {
  return {
    name: 'radonis-islands',
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
        return { path, namespace: AssetType.IslandScript }
      })

      onLoad({ filter: /.*/, namespace: AssetType.IslandScript }, async ({ path }) => {
        let contents = await readFile(path, { encoding: 'utf-8' })

        const matches = contents.matchAll(ISLAND_REGEX)
        const islands = new Set<string>()

        for (const match of matches) {
          if (match?.groups?.identifier && match?.groups?.symbol) {
            const identifier = match.groups.identifier
            const symbol = match.groups.symbol

            islands.add(identifier)

            contents = contents.replace(match[0], `__internal__hydrateIsland('${identifier}', ${symbol})`)
          }
        }

        contents = ["import { __internal__hydrateIsland } from '@microeinhundert/radonis';", contents].join('\n')

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
  }
}
