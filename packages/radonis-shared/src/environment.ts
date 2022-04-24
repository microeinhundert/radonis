/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Whether the current environment is a server or not
 */
export const isServer = typeof window === 'undefined' && typeof globalThis !== 'undefined'

/**
 * Whether the current environment is production or not
 */
export const isProduction = process.env.NODE_ENV === 'production'

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
export function getManifestOrFail(): Radonis.Manifest {
  const manifest = (globalThis ?? window).radonisManifest

  if (!manifest) {
    throw new Error('Could not get the Radonis manifest. Make sure the server provider is configured properly')
  }

  return manifest
}
