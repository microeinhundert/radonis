/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * This variable will be replaced during the client build
 */
export const isServer = true

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
export function getManifestOrFail(): Radonis.Manifest {
  const manifest = (globalThis ?? window).manifest

  if (!manifest) {
    throw new Error(
      `Could not get the Radonis manifest.
       Make sure the server provider is configured properly`
    )
  }

  return manifest
}
