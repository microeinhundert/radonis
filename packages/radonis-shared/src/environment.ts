/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from './invariant'

/**
 * Whether the current environment is a server or not
 */
export const isServer = typeof document === 'undefined' && typeof globalThis !== 'undefined'

/**
 * Whether the current environment is production or not
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
export function getManifestOrFail(): Radonis.Manifest {
  const manifest = (globalThis ?? window).radonisManifest

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return manifest
}
