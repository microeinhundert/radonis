/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, relative } from 'node:path'

import { normalizePath, stripLeadingSlash } from '@microeinhundert/radonis-shared'
import { ensureDirExists } from '@microeinhundert/radonis-shared/node'
import { AssetType } from '@microeinhundert/radonis-types'
import type { Plugin, PluginBuild } from 'esbuild'
import { transform } from 'esbuild'

import { ISLAND_REGEX } from './constants'
import { E_CANNOT_FIND_OUTPUT } from './exceptions'
import { getLoaderForFile } from './loaders'
import type { BuiltAssets, IslandsByFile, RadonisPluginOptions } from './types/main'
import { extractTokens, getOutputMeta } from './utils'

/**
 * Radonis plugin for esbuild
 */
export class RadonisPlugin implements Plugin {
  #options: RadonisPluginOptions

  name = 'radonis'

  constructor(options: RadonisPluginOptions) {
    this.#options = options
  }

  setup({ onResolve, onLoad, onEnd, initialOptions }: PluginBuild): void {
    const islandsByFile: IslandsByFile = new Map()

    /**
     * Process client scripts
     */
    onResolve({ filter: /\.client\.(ts(x)?|js(x)?)$/ }, ({ path, kind }) => {
      if (kind !== 'entry-point') {
        return null
      }

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

    /**
     * Process island scripts
     */
    onResolve({ filter: /\.island\.(ts(x)?|js(x)?)$/ }, ({ path, kind }) => {
      if (kind !== 'entry-point') {
        return null
      }

      return { path, namespace: AssetType.IslandScript }
    })
    onLoad({ filter: /.*/, namespace: AssetType.IslandScript }, async ({ path }) => {
      let contents = await readFile(path, { encoding: 'utf-8' })

      const matches = contents.matchAll(ISLAND_REGEX)
      const islands = new Set<string>()

      for (const match of matches) {
        const identifier = match?.groups?.identifier
        const symbol = match?.groups?.symbol

        if (!identifier || !symbol) {
          continue
        }

        islands.add(identifier)

        contents = contents.replace(match[0], `__internal__hydrateIsland('${identifier}', ${symbol})`)
      }

      contents = ["import { __internal__hydrateIsland } from '@microeinhundert/radonis';", contents].join('\n')

      islandsByFile.set(normalizePath(relative(initialOptions.outbase!, path)), Array.from(islands))

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
      }
    })

    onEnd(async ({ outputFiles, metafile }) => {
      if (!outputFiles) {
        return
      }

      const builtAssets: BuiltAssets = new Map()

      for (const { path, text, contents } of outputFiles) {
        await ensureDirExists(path)

        if (this.#options.minify) {
          const transformResult = await transform(text, { minify: true })
          await writeFile(path, transformResult.code)
        } else {
          await writeFile(path, contents)
        }

        const pathRelativeToOutbase = normalizePath(relative(initialOptions.outbase!, path))
        const pathRelativeToPublic = normalizePath(relative(this.#options.publicPath, path))

        const assetKey = stripLeadingSlash(pathRelativeToOutbase)
        const output = metafile?.outputs[assetKey]
        if (!output) {
          throw new E_CANNOT_FIND_OUTPUT([assetKey])
        }

        try {
          const { type, originalPath } = getOutputMeta(output)
          const islands = originalPath
            ? islandsByFile.get(normalizePath(relative(initialOptions.outbase!, originalPath))) ?? []
            : []

          builtAssets.set(assetKey, {
            type,
            name: basename(pathRelativeToOutbase),
            path: pathRelativeToPublic,
            islands,
            imports: output.imports,
            tokens: extractTokens(text),
          })
        } catch {
          continue
        }
      }

      this.#options.onEnd?.(builtAssets)
      islandsByFile.clear()
    })
  }
}
