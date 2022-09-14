/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isClient } from '@microeinhundert/radonis-shared'
import type { RadonisContract, RouteIdentifier } from '@microeinhundert/radonis-types'
import { dehydrate } from '@tanstack/react-query'

import { getQueryClient } from './queryClient'
import type { RadonisContractWithQueryPrefetcher } from './types'

/**
 * Create a prefetcher for prefetching queries server-side
 * @see {@link https://radonis.vercel.app/docs/plugins/query#prefetching-data}
 */
export function createQueryPrefetcher() {
  invariant(!isClient, 'Prefetching queries is not supported on the client')

  const queryClient = getQueryClient()
  const prefetchedQueries: Promise<void>[] = []

  /**
   * Attach the dehydrated query state to the Radonis context
   */
  async function attach(context: RadonisContract) {
    await Promise.all(prefetchedQueries)
    context.withGlobals({ dehydratedQueryState: dehydrate(queryClient) })
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
    attach,
  }
}

/**
 * Extend the Radonis context with query prefetching capabilities
 * @see {@link https://radonis.vercel.app/docs/plugins/query#prefetching-data}
 */
export function withQueryPrefetcher(context: RadonisContract) {
  const queryPrefetcher = createQueryPrefetcher()

  /**
   * Prefetch queries
   */
  function prefetch(this: RadonisContractWithQueryPrefetcher, queries: Partial<Record<RouteIdentifier, unknown>>) {
    for (const [routeIdentifier, data] of Object.entries(queries)) {
      queryPrefetcher.prefetch(routeIdentifier, data)
    }
    return this
  }

  /**
   * Render the view and attach the dehydrated query state
   */
  async function render(this: RadonisContractWithQueryPrefetcher, ...params: Parameters<RadonisContract['render']>) {
    await queryPrefetcher.attach(this)
    return this.render(...params)
  }

  /**
   * Extend the prototype
   */
  const contextWithQueryPrefetcher = context as RadonisContractWithQueryPrefetcher

  Object.defineProperty(contextWithQueryPrefetcher, 'prefetch', {
    writable: true,
    enumerable: false,
    value: prefetch,
  })
  Object.defineProperty(contextWithQueryPrefetcher, 'render', {
    writable: true,
    enumerable: false,
    value: render,
  })

  return contextWithQueryPrefetcher
}
