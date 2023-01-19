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

import { CannotFindMetafileOutputEntryException } from './exceptions/cannot_find_metafile_output_entry'
import type { BuiltAssets, IslandsByFile } from './types/main'
import { extractFlashMessages, extractMessages, extractRoutes } from './utils'

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

    return outputs.reduce<AssetsManifest>((assetsManifest, [path, { entryPoint }]) => {
      if (!entryPoint) {
        /**
         * We only want entry points
         * on the topmost level
         */
        return assetsManifest
      }

      const asset = this.#builtAssets.get(path)

      if (!asset) {
        return assetsManifest
      }

      return [...assetsManifest, this.#createEntry(path, entryPoint)]
    }, [])
  }

  /**
   * Reduce the hydration requirements of multiple entries down to a single entry
   */
  #reduceHydrationRequirements(entries: Asset[]): HydrationRequirements {
    return entries.reduce<HydrationRequirements>(
      (requirements, entry) => {
        const mergedFlashMessages = new Set([...requirements.flashMessages, ...entry.flashMessages])
        const mergedMessages = new Set([...requirements.messages, ...entry.messages])
        const mergedRoutes = new Set([...requirements.routes, ...entry.routes])

        return {
          flashMessages: Array.from(mergedFlashMessages),
          messages: Array.from(mergedMessages),
          routes: Array.from(mergedRoutes),
        }
      },
      {
        flashMessages: [],
        messages: [],
        routes: [],
      }
    )
  }

  /**
   * Create a chunk for a specified path from the metafile
   */
  #createChunk(path: string): Asset {
    const output = this.#metafile.outputs[path]
    const asset = this.#builtAssets.get(path)

    if (!output || !asset) {
      throw new CannotFindMetafileOutputEntryException(path)
    }

    return {
      type: 'chunk-script',
      path: asset.path,
      name: asset.name,
      islands: [],
      flashMessages: extractFlashMessages(asset.source),
      messages: extractMessages(asset.source),
      routes: extractRoutes(asset.source),
    }
  }

  /**
   * Create an entry for a specified path from the metafile
   */
  #createEntry(path: string, entryPoint: string): Asset {
    const output = this.#metafile.outputs[path]

    const [type, originalPath] = entryPoint.split(':')

    const asset = this.#builtAssets.get(path)

    if (!output || !asset) {
      throw new CannotFindMetafileOutputEntryException(path)
    }

    const imports = output.imports.map(({ path: chunkPath }) => this.#createChunk(chunkPath))
    const islands = this.#islandsByFile.get(originalPath) ?? []

    const entry = {
      type: type as AssetType,
      path: asset.path,
      name: asset.name,
      islands,
      flashMessages: extractFlashMessages(asset.source),
      messages: extractMessages(asset.source),
      routes: extractRoutes(asset.source),
    } as Asset

    return {
      ...entry,
      ...this.#reduceHydrationRequirements([entry, ...imports]),
    }
  }
}
