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
export type BuiltAsset = {
  type: AssetType
  name: string
  path: string
  source: string
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
  watch?: boolean
  esbuildOptions?: EsbuildOptions
}

/**
 * `onBuildEnd` callback
 */
export type OnBuildEndCallback = (builtAssets: BuiltAssets) => MaybePromise<void>

/**
 * Options for the assets plugin
 */
export type AssetsPluginOptions = {
  publicPath: string
  outputToDisk?: boolean
  onEnd?: (builtAssets: BuiltAssets) => void
}
