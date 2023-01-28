/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetType, HydrationRequirements, MaybePromise } from '@microeinhundert/radonis-types'
import type { BuildOptions as EsbuildOptions, Metafile } from 'esbuild'

/**
 * Built asset
 */
export interface BuiltAsset extends HydrationRequirements {
  type: AssetType
  name: string
  path: string
  islands: Islands
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
  outputToDisk?: boolean
  outputForProduction?: boolean
  rebuildOnFileChanges?: boolean
  esbuildOptions?: EsbuildOptions
}

/**
 * `onBuildEnd` callback
 */
export type OnBuildEndCallback = (builtAssets: BuiltAssets) => MaybePromise<void>

/**
 * Assets plugin options
 */
export type AssetsPluginOptions = {
  publicPath: string
  outputToDisk?: boolean
  onEnd?: (builtAssets: BuiltAssets) => MaybePromise<void>
}
