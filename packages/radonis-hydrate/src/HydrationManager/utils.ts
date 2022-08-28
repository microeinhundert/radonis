/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isClient } from '@microeinhundert/radonis-shared'
import type { Manifest } from '@microeinhundert/radonis-types'
import superjson from 'superjson'
import type { SuperJSONResult } from 'superjson/dist/types'

declare global {
  var radonisManifest: Manifest | undefined

  interface Window {
    radonisManifest: Manifest | undefined
  }
}

let cachedManifest: Readonly<Manifest> | undefined

/**
 * Get the manifest, fail if it does not exist on the global scope
 */
export function getManifestOrFail() {
  if (cachedManifest && isClient) {
    return cachedManifest
  }

  const manifest = (globalThis ?? window).radonisManifest

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return (cachedManifest = isClient
    ? superjson.deserialize(manifest as unknown as SuperJSONResult)
    : manifest) as Readonly<Manifest>
}
