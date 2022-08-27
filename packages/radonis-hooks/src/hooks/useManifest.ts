/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import type { Manifest, Props } from '@microeinhundert/radonis-types'
import superjson from 'superjson'

declare global {
  var radonisManifest: Manifest | undefined

  interface Window {
    radonisManifest: Manifest | undefined
  }
}

let cachedManifest: Manifest | undefined

/**
 * Hook for retrieving the manifest
 */
export function useManifest() {
  if (cachedManifest) {
    return cachedManifest as Readonly<Manifest>
  }

  const manifest = (globalThis ?? window).radonisManifest

  invariant(manifest, 'Could not get the Radonis manifest. Make sure the server provider was configured properly')

  return (cachedManifest = {
    ...manifest,
    props: superjson.deserialize<Props>(manifest.props as any),
  }) as Readonly<Manifest>
}
