/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import type { Manifest } from '@microeinhundert/radonis-types'

declare global {
  var radonisManifest: Manifest | undefined

  interface Window {
    radonisManifest: Manifest | undefined
  }
}

/**
 * Hook for retrieving the manifest
 */
export function useManifest() {
  const manifest = (globalThis ?? window).radonisManifest

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return manifest as Readonly<Manifest>
}
