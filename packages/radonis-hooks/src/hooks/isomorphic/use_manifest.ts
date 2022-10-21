/*
 * @microeinhundert/radonis-hooks
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

import { HookException } from '../../exceptions/hook_exception'

declare global {
  var radonisManifest: ManifestContract | undefined
}

let cachedManifest: Readonly<ManifestContract> | undefined

/**
 * Hook for retrieving the manifest
 * @see https://radonis.vercel.app/docs/hooks/use-manifest
 */
export function useManifest() {
  if (cachedManifest && isClient) {
    return cachedManifest
  }

  const manifest = globalThis.radonisManifest

  if (!manifest) {
    throw HookException.missingManifest()
  }

  return (cachedManifest = isClient
    ? superjson.deserialize(manifest as unknown as SuperJSONResult)
    : manifest) as Readonly<ManifestContract>
}
