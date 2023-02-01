/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { nonNull } from '@microeinhundert/radonis-shared'
import type { Asset, AssetsManifest } from '@microeinhundert/radonis-types'

import type { BuiltAsset, BuiltAssets } from './types/main'

export class AssetsManifestBuilder {
  /**
   * The built assets
   */
  #builtAssets: BuiltAssets

  constructor(builtAssets: BuiltAssets) {
    this.#builtAssets = builtAssets
  }

  /**
   * Build the assets manifest
   */
  build(): AssetsManifest {
    return nonNull(Array.from(this.#builtAssets).flatMap(([_, asset]) => this.#createEntry(asset)))
  }

  /**
   * Reduce the tokens of multiple assets down to a single asset
   */
  #reduceTokens(assets: Asset[]): string[] {
    return Array.from(
      assets.reduce<Set<string>>((tokens, asset) => {
        asset.tokens.forEach((token) => tokens.add(token))
        return tokens
      }, new Set())
    )
  }

  /**
   * Create the entry for an asset
   */
  #createEntry({ imports, ...asset }: BuiltAsset): Asset {
    const chunks = nonNull(
      imports.map(({ path: importPath, external }) => {
        if (external) {
          return null
        }

        const chunkAsset = this.#builtAssets.get(importPath)

        return chunkAsset ? this.#createEntry(chunkAsset) : null
      })
    )

    if (chunks.length) {
      return {
        ...asset,
        tokens: this.#reduceTokens([asset, ...chunks]),
      }
    }

    return asset
  }
}
