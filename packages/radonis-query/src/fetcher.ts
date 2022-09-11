/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useUrlBuilder } from '@microeinhundert/radonis'
import type { RouteIdentifier } from '@microeinhundert/radonis-types'
import { dehydrate, useQuery as useReactQuery } from '@tanstack/react-query'
import { deserialize } from 'superjson'

import { queryClient } from './plugin'
import type { FetcherOptions, UrlFactory } from './types'

/**
 * Create a fetcher
 * @see {@link https://radonis.vercel.app/docs/plugins/query#creating-fetchers}
 */
export function createFetcher<TData>(routeIdentifier: RouteIdentifier, options?: FetcherOptions) {
  const fetcherKey = [routeIdentifier, options?.params, options?.queryParams]

  /**
   * Init the fetcher function
   */
  function initFetcherFn(url: string) {
    return async () => {
      const response = await fetch(url, {
        headers: { Accept: 'application/json', ...options?.headers },
      })

      if (!response.ok) {
        throw new Error(`The network request to "${routeIdentifier}" failed`)
      }

      const json = await response.json()

      return deserialize<TData>(json)
    }
  }

  /**
   * Prefetch a query on the server
   * @see {@link https://radonis.vercel.app/docs/plugins/query#prefetching-queries}
   */
  async function prefetchQuery(urlFactory: UrlFactory) {
    await queryClient.prefetchQuery(
      fetcherKey,
      initFetcherFn(
        urlFactory.apply(queryClient, {
          routeIdentifier,
          params: options?.params,
          queryParams: options?.queryParams,
        })
      )
    )

    return {
      dehydratedState: dehydrate(queryClient),
    }
  }

  /**
   * Hook for querying data in React components
   * @see {@link https://radonis.vercel.app/docs/plugins/query#querying-data}
   */
  function useQuery() {
    const urlBuilder = useUrlBuilder()

    const url = urlBuilder.make(routeIdentifier, {
      params: options?.params,
      queryParams: options?.queryParams,
    })

    return useReactQuery<TData>(fetcherKey, initFetcherFn(url))
  }

  return {
    prefetchQuery,
    useQuery,
  }
}
