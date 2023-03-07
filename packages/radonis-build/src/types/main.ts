/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetType, MaybePromise } from '@microeinhundert/radonis-types'
import type { BuildOptions as EsbuildOptions, Metafile } from 'esbuild'

/**
 * Built asset
 */
export interface BuiltAsset {
  type: AssetType
  name: string
  path: string
  islands: Islands
  tokens: string[]
  imports: Metafile['outputs'][0]['imports']
}

/**
 * Built assets
 */
export type BuiltAssets = Map<string, BuiltAsset>

/**
 * Islands
 */
export type Islands = string[]

/**
 * Islands by file
 */
export type IslandsByFile = Map<string, Islands>

/**
 * Build options
 */
export interface BuildOptions {
  entryPoints: string[]
  appRootPath: string
  publicPath: string
  outputPath: string
  outputForProduction?: boolean
  rebuildOnFileChanges?: boolean
  esbuildOptions?: EsbuildOptions
}

/**
 * Radonis plugin options
 */
export type RadonisPluginOptions = {
  publicPath: string
  minify?: boolean
  onEnd?: (builtAssets: BuiltAssets) => MaybePromise<void>
}
