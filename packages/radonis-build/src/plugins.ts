/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { basename, dirname, join, relative } from 'node:path'

import type { Plugin } from 'esbuild'
import { outputFile, readFile } from 'fs-extra'

import { ISLAND_REGEX } from './constants'
import { getLoaderForFile } from './loaders'
import type { AssetsPluginOptions, BuiltAssets, IslandsByFile } from './types/main'

/**
 * @internal
 */
export const radonisIslandsPlugin = (): Plugin => ({
  name: 'radonis-islands',
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, async ({ path }) => {
      return { path, namespace: 'radonis-island-script' }
    })

    onLoad({ filter: /.*/, namespace: 'radonis-island-script' }, async ({ path }) => {
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
        },
      }
    })
  },
})

/**
 * @internal
 */
export const radonisClientPlugin = (): Plugin => ({
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

/**
 * @internal
 */
export const radonisAssetsPlugin = (options: AssetsPluginOptions): Plugin => ({
  name: 'radonis-assets',
  setup({ onStart, onLoad, onEnd, initialOptions }) {
    const islandsByFile: IslandsByFile = new Map()

    onStart(() => {
      islandsByFile.clear()
    })

    onLoad({ filter: /.*/, namespace: 'radonis-island-script' }, async ({ path, pluginData }) => {
      if (pluginData?.islands?.length) {
        if (!islandsByFile.has(path)) {
          islandsByFile.set(path, [])
        }

        islandsByFile.set(path, pluginData.islands)
      }

      return null
    })

    onEnd(({ outputFiles, metafile }) => {
      const builtAssets: BuiltAssets = new Map()

      for (const { path, text, contents } of outputFiles ?? []) {
        if (options.outputToDisk) {
          outputFile(path, contents)
        }

        const pathRelativeToOutbase = relative(initialOptions.outbase!, path)
        const pathRelativeToPublic = relative(options.publicPath, path)

        const output = metafile?.outputs[pathRelativeToOutbase]
        if (!output) {
          continue
        }

        /**
         * TODO: Evaluate whether these checks
         * conflict with third-party esbuild plugins
         */
        if (output.entryPoint?.includes(':')) {
          const [type, originalPath] = output.entryPoint.split(':')
          const islands = islandsByFile.get(originalPath) ?? []

          if (!(type === 'radonis-client-script' || type === 'radonis-island-script')) {
            continue
          }

          builtAssets.set(pathRelativeToOutbase, {
            type,
            name: basename(pathRelativeToOutbase),
            path: join('/', pathRelativeToPublic),
            source: text,
            islands,
            imports: output.imports,
          })
        } else {
          builtAssets.set(pathRelativeToOutbase, {
            type: 'radonis-chunk-script',
            name: basename(pathRelativeToOutbase),
            path: join('/', pathRelativeToPublic),
            source: text,
            islands: [],
            imports: [],
          })
        }

        options.onEnd?.(builtAssets)
      }
    })
  },
})
