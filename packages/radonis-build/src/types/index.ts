/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HydrationRequirements } from '@microeinhundert/radonis-types'

/**
 * Build manifest entry
 */
export interface BuildManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry' | 'chunk'
  path: string
  imports: BuildManifestEntry[]
}

/**
 * Build manifest
 */
export type BuildManifest = Record<string, BuildManifestEntry>

/**
 * Assets manifest entry
 */
export interface AssetsManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry'
  identifier: string
  path: string
}

/**
 * Assets manifest
 */
export type AssetsManifest = AssetsManifestEntry[]
