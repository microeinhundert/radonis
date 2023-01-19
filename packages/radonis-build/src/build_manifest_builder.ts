/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Asset, AssetType, BuildManifest, HydrationRequirements } from '@microeinhundert/radonis-types'
import type { Metafile } from 'esbuild'

import { CannotFindMetafileOutputEntryException } from './exceptions/cannot_find_metafile_output_entry'
import type { BuiltAsset } from './types/main'
import { extractFlashMessages, extractMessages, extractRoutes } from './utils'

/**
 * @internal
 */
export class BuildManifestBuilder {
  /**
   * The esbuild generated metafile
   */
  #metafile: Metafile

  /**
   * The built assets
   */
  #builtAssets: Map<string, BuiltAsset>

  /**
   * The islands grouped by file
   */
  #islandsByFile: Map<string, string[]>

  constructor(metafile: Metafile, builtAssets: Map<string, BuiltAsset>, islandsByFile: Map<string, string[]>) {
    this.#metafile = metafile
    this.#builtAssets = builtAssets
    this.#islandsByFile = islandsByFile
  }

  /**
   * Build the manifest
   */
  build(): BuildManifest {
    const outputs = Object.entries(this.#metafile.outputs)

    return outputs.reduce<BuildManifest>((buildManifest, [path, { entryPoint }]) => {
      if (!entryPoint) {
        /**
         * We only want entry points
         * on the topmost level
         */
        return buildManifest
      }

      const asset = this.#builtAssets.get(path)

      if (!asset) {
        return buildManifest
      }

      return [...buildManifest, this.#createEntry(path, entryPoint)]
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
