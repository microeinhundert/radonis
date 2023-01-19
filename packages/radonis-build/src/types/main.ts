/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { BuildOptions as EsbuildOptions } from 'esbuild'

/**
 * Built asset
 */
export type BuiltAsset = { name: string; path: string; source: string }

/**
 * Built assets
 */
export type BuiltAssets = Map<string, BuiltAsset>

/**
 * Islands by file
 */
export type IslandsByFile = Map<string, string[]>

/**
 * Build options
 */
export interface BuildOptions {
  entryPoints: string[]
  publicDir: string
  outputDir: string
  outputToDisk?: boolean
  outputForProduction?: boolean
  esbuildOptions?: EsbuildOptions
}
