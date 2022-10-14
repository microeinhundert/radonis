/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteIdentifier } from '@microeinhundert/radonis'
import { useUrlBuilder } from '@microeinhundert/radonis'
import { useQuery } from '@tanstack/react-query'
import superjson from 'superjson'

import { QueryException } from '../exceptions/queryException'
import type { QueryOptions } from '../types'

/**
 * Hook for querying server data in React components
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useServerQuery<TData = unknown, TError = unknown>(
  routeIdentifier: RouteIdentifier,
  options?: QueryOptions<TData, TError>
) {
  const urlBuilder = useUrlBuilder()

  const url = urlBuilder.make(routeIdentifier, {
    params: options?.params,
    queryParams: options?.queryParams,
  })

  const queryKey = [routeIdentifier, options?.params, options?.queryParams]

  return useQuery<TData, TError>(
    queryKey,
    async () => {
      const response = await fetch(url, {
        headers: { ...options?.headers, 'Accept': 'application/json', 'X-Radonis-Request': 'true' },
      })

      if (!response.ok) {
        throw QueryException.requestFailed(routeIdentifier, response.status)
      }

      const json = await response.json()

      return superjson.deserialize(json)
    },
    options?.query
  )
}
