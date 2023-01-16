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
 * Asset
 */
export type Asset = { name: string; path: string; source: string }

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
