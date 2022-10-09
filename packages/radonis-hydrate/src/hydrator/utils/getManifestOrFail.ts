/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isClient } from '@microeinhundert/radonis-shared'
import type { ManifestContract } from '@microeinhundert/radonis-types'
import superjson from 'superjson'
import type { SuperJSONResult } from 'superjson/dist/types'

import { HydrateException } from '../../exceptions/hydrateException'

declare global {
  var radonisManifest: ManifestContract | undefined
}

let cachedManifest: Readonly<ManifestContract> | undefined

/**
 * Get the manifest, fail if it does not exist on the global scope
 * @internal
 */
export function getManifestOrFail() {
  if (cachedManifest && isClient) {
    return cachedManifest
  }

  const manifest = globalThis.radonisManifest

  if (!manifest) {
    throw HydrateException.manifestUnavailable()
  }

  return (cachedManifest = isClient
    ? superjson.deserialize(manifest as unknown as SuperJSONResult)
    : manifest) as Readonly<ManifestContract>
}
