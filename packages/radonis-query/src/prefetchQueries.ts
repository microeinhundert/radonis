/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isClient } from '@microeinhundert/radonis-shared'
import type { RendererContract, RouteIdentifier } from '@microeinhundert/radonis-types'
import { dehydrate } from '@tanstack/react-query'

import { getQueryClient } from './queryClient'

/**
 * Prefetch queries server-side
 * @see https://radonis.vercel.app/docs/plugins/query#prefetching-data
 */
export function prefetchQueries(queries: Partial<Record<RouteIdentifier, unknown>>) {
  invariant(!isClient, 'Prefetching queries is only supported server-side')

  const queryClient = getQueryClient()
  const prefetchedQueries: Promise<void>[] = []

  for (const [routeIdentifier, data] of Object.entries(queries)) {
    prefetchedQueries.push(queryClient.prefetchQuery([routeIdentifier], () => data))
  }

  /**
   * Attach the dehydrated query state to the renderer
   */
  async function attachState(renderer: RendererContract) {
    await Promise.all(prefetchedQueries)

    renderer.withGlobals({ dehydratedQueryState: dehydrate(queryClient) })
  }

  return {
    attachState,
  }
}
