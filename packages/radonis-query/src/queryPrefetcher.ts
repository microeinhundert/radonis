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
 * Create a prefetcher for prefetching queries server-side
 * @see {@link https://radonis.vercel.app/docs/plugins/query#prefetching-data}
 */
export function createQueryPrefetcher() {
  invariant(!isClient, 'Prefetching queries is not supported client-side')

  const queryClient = getQueryClient()
  const prefetchedQueries: Promise<void>[] = []

  /**
   * Attach the dehydrated query state to the renderer
   */
  async function attach(renderer: RendererContract) {
    await Promise.all(prefetchedQueries)

    renderer.withGlobals({ dehydratedQueryState: dehydrate(queryClient) })
  }

  /**
   * Prefetch a query
   */
  function prefetch(routeIdentifier: RouteIdentifier, data: unknown) {
    prefetchedQueries.push(queryClient.prefetchQuery([routeIdentifier], () => data))

    return {
      prefetch,
      attach,
    }
  }

  return {
    prefetch,
  }
}
