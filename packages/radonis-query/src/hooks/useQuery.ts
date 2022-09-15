/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useUrlBuilder } from '@microeinhundert/radonis'
import { invariant } from '@microeinhundert/radonis-shared'
import type { RouteIdentifier } from '@microeinhundert/radonis-types'
import { useQuery as useQuery$ } from '@tanstack/react-query'
import { deserialize } from 'superjson'

import type { QueryOptions } from '../types'

/**
 * Hook for querying data from the server inside of React components
 * @see {@link https://radonis.vercel.app/docs/plugins/query#querying-data}
 */
export function useQuery<TData = unknown, TError = unknown>(
  routeIdentifier: RouteIdentifier,
  options?: QueryOptions<TData, TError>
) {
  const urlBuilder = useUrlBuilder()

  const url = urlBuilder.make(routeIdentifier, {
    params: options?.params,
    queryParams: options?.queryParams,
  })

  const queryKey = [routeIdentifier, options?.params, options?.queryParams]

  return useQuery$<TData, TError>(
    queryKey,
    async () => {
      const response = await fetch(url, {
        headers: { ...options?.headers, 'Accept': 'application/json', 'X-Radonis-Request': 'true' },
      })

      invariant(response.ok, `The network request to route "${routeIdentifier}" failed`)

      const json = await response.json()

      return deserialize<TData>(json)
    },
    options?.query
  )
}
