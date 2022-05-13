/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Manifest } from '@microeinhundert/radonis-types'

import { invariant } from './utils'

/**
 * Whether the current environment is a server or not
 */
export const isServer = typeof document === 'undefined' && typeof globalThis !== 'undefined'

/**
 * Whether the current environment is a client or not
 */
export const isClient = !isServer

/**
 * Whether the current environment is production or not
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
let cachedManifest: Manifest | null = null
export function getManifestOrFail(): Manifest {
  if (cachedManifest) {
    return cachedManifest
  }

  const manifest = (globalThis ?? window).radonisManifest

  if (isClient && isProduction) {
    document.querySelector('#rad-manifest')?.remove()
  }

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return (cachedManifest = manifest)
}
