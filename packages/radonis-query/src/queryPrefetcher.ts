/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Globals, RouteIdentifier } from '@microeinhundert/radonis-types'
import { dehydrate } from '@tanstack/react-query'

import { getQueryClient } from './queryClient'

/**
 * Create a prefetcher for prefetching queries server-side
 * @see {@link https://radonis.vercel.app/docs/plugins/query#prefetching-data}
 */
export function createQueryPrefetcher() {
  const queryClient = getQueryClient()
  const prefetchedQueries: Promise<void>[] = []

  /**
   * Attach the dehydrated query state to a Radonis instance
   */
  async function attach(instance: { withGlobals(globals: Globals): unknown }) {
    await Promise.all(prefetchedQueries)
    instance.withGlobals({ dehydratedQueryState: dehydrate(queryClient) })
  }

  /**
   * Prefetch a query server-side
   */
  function prefetch<TData = unknown>(routeIdentifier: RouteIdentifier, data: TData) {
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
