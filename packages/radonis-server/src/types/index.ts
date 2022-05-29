/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentIdentifier, HydrationRequirements } from '@microeinhundert/radonis-types'
import type { ReactElement, ReactNode } from 'react'

/**
 * Build manifest entry
 */
export interface BuildManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry' | 'chunk'
  path: string
  publicPath: string
  imports: BuildManifestEntry[]
}

/**
 * Build manifest
 */
export type BuildManifest = Record<string, BuildManifestEntry>

/**
 * Document props
 */
export interface DocumentProps {
  children: ReactNode
}

/**
 * Hydration root props
 */
export interface HydrationRootProps {
  children: ReactElement<Record<string, any>>
  component: ComponentIdentifier
}
