/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { BuildOptions as EsbuildOptions, Metafile } from 'esbuild'

/**
 * Build options
 */
export interface BuildOptions {
  entryFilePath: string
  entryPoints: string[]
  publicPath: string
  outputDir: string
  outputToDisk?: boolean
  outputForProduction?: boolean
  esbuildOptions?: EsbuildOptions
}

/**
 * Generate build manifest options
 */
export interface GenerateBuildManifestOptions {
  metafile: Metafile
  entryFileName: string
  builtAssets: Map<string, string>
  publicPath: string
}

/**
 * Metafile walker options
 */
export interface MetafileWalkerOptions {
  metafile: Metafile
  builtAssets: Map<string, string>
  publicPath: string
}
