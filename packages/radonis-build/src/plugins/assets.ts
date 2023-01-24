/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { basename, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

import type { Plugin } from 'esbuild'
import { outputFile } from 'fs-extra'

import type { AssetsPluginOptions, BuiltAssets, IslandsByFile } from '../types/main'
import { extractFlashMessages, extractMessages, extractRoutes } from '../utils'

/**
 * @internal
 */
export const assetsPlugin = (options: AssetsPluginOptions): Plugin => ({
  name: 'radonis-assets',
  setup({ onStart, onResolve, onEnd, initialOptions }) {
    const islandsByFile: IslandsByFile = new Map()

    onStart(() => {
      islandsByFile.clear()
    })

    onResolve({ filter: /.*/, namespace: 'radonis-island-script' }, async ({ pluginData }) => {
      if (pluginData?.islands?.length && pluginData?.originalPath) {
        islandsByFile.set(pluginData?.originalPath, pluginData.islands)
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
            path: pathToFileURL(join('/', pathRelativeToPublic)).href,
            islands,
            imports: output.imports,
            flashMessages: extractFlashMessages(text),
            messages: extractMessages(text),
            routes: extractRoutes(text),
          })
        } else {
          builtAssets.set(pathRelativeToOutbase, {
            type: 'radonis-chunk-script',
            name: basename(pathRelativeToOutbase),
            path: pathToFileURL(join('/', pathRelativeToPublic)).href,
            islands: [],
            imports: [],
            flashMessages: extractFlashMessages(text),
            messages: extractMessages(text),
            routes: extractRoutes(text),
          })
        }

        options.onEnd?.(builtAssets)
      }
    })
  },
})
