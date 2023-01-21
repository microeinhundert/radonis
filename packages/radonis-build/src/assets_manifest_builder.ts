/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Asset, AssetsManifest, AssetType, HydrationRequirements } from '@microeinhundert/radonis-types'
import type { Metafile } from 'esbuild'

import type { BuiltAsset, BuiltAssets, IslandsByFile, MetafileOutput } from './types/main'
import { dedupe, extractFlashMessages, extractMessages, extractRoutes, nonNull } from './utils'

/**
 * @internal
 */
export class AssetsManifestBuilder {
  /**
   * The esbuild generated metafile
   */
  #metafile: Metafile

  /**
   * The built assets
   */
  #builtAssets: BuiltAssets

  /**
   * The islands grouped by file
   */
  #islandsByFile: IslandsByFile

  constructor(metafile: Metafile, builtAssets: BuiltAssets, islandsByFile: IslandsByFile) {
    this.#metafile = metafile
    this.#builtAssets = builtAssets
    this.#islandsByFile = islandsByFile
  }

  /**
   * Build the assets manifest
   */
  build(): AssetsManifest {
    const outputs = Object.entries(this.#metafile.outputs)

    return nonNull(
      outputs.flatMap(([path, output]) => {
        const asset = this.#builtAssets.get(path)
        return asset ? this.#createEntry(asset, output) : null
      })
    )
  }

  /**
   * Reduce the hydration requirements of multiple entries down to a single entry
   */
  #reduceHydrationRequirements(assets: Asset[]): HydrationRequirements {
    const { flashMessages, messages, routes } = assets.reduce<HydrationRequirements>(
      (requirements, entry) => ({
        flashMessages: [...requirements.flashMessages, ...entry.flashMessages],
        messages: [...requirements.messages, ...entry.messages],
        routes: [...requirements.routes, ...entry.routes],
      }),
      {
        flashMessages: [],
        messages: [],
        routes: [],
      }
    )

    return {
      flashMessages: dedupe(flashMessages),
      messages: dedupe(messages),
      routes: dedupe(routes),
    }
  }

  /**
   * Create the chunk for an asset
   */
  #createChunk(asset: BuiltAsset): Asset {
    return {
      type: 'radonis-chunk-script',
      path: asset.path,
      name: asset.name,
      islands: [],
      flashMessages: extractFlashMessages(asset.source),
      messages: extractMessages(asset.source),
      routes: extractRoutes(asset.source),
    }
  }

  /**
   * Create the entry for an asset
   */
  #createEntry(asset: BuiltAsset, output: MetafileOutput): Asset | null {
    if (!output.entryPoint) {
      /**
       * We only want entry points
       */
      return null
    }

    const [type, originalPath] = output.entryPoint.split(':')
    const islands = this.#islandsByFile.get(originalPath) ?? []

    if (!type || !originalPath) {
      return null
    }

    const entry = {
      type: type as AssetType,
      path: asset.path,
      name: asset.name,
      islands,
      flashMessages: extractFlashMessages(asset.source),
      messages: extractMessages(asset.source),
      routes: extractRoutes(asset.source),
    } as Asset

    const chunks = nonNull(
      output.imports.map(({ path: chunkPath }) => {
        const chunkAsset = this.#builtAssets.get(chunkPath)
        return chunkAsset ? this.#createChunk(chunkAsset) : null
      })
    )

    return {
      ...entry,
      ...this.#reduceHydrationRequirements([entry, ...chunks]),
    }
  }
}
