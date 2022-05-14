/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import type { Manifest } from '@microeinhundert/radonis-types'

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
export function getManifestOrFail(): Manifest {
  const manifest = (globalThis ?? window).radonisManifest

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return manifest
}
