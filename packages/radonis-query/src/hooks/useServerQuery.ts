/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RouteIdentifier } from '@microeinhundert/radonis'
import { useUrlBuilder } from '@microeinhundert/radonis'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import superjson from 'superjson'

import { baseUrlContext } from '../contexts/baseUrlContext'
import { QueryException } from '../exceptions/queryException'
import type { ServerQueryOptions } from '../types'

/**
 * Hook for querying server data in React components
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useServerQuery<TControllerAction extends (ctx: HttpContextContract) => any, TError = unknown>(
  routeIdentifier: RouteIdentifier,
  options?: ServerQueryOptions<Awaited<ReturnType<TControllerAction>>, TError>
) {
  const urlBuilder = useUrlBuilder()
  const baseUrl = useContext(baseUrlContext)

  const url = urlBuilder.make(routeIdentifier, {
    baseUrl,
    params: options?.params,
    queryParams: options?.queryParams,
  })

  const urlQueryKey = url.replace(baseUrl ?? '', '').split('/')
  const queryKey = [routeIdentifier, urlQueryKey, options?.query?.queryKey].flat().filter(Boolean)

  const queryFn = async () => {
    const response = await fetch(url, {
      headers: { ...options?.headers, 'Accept': 'application/json', 'X-Radonis-Request': 'true' },
    })

    if (!response.ok) {
      throw QueryException.requestFailed(routeIdentifier, response.status)
    }

    const json = await response.json()

    return superjson.deserialize<any>(json)
  }

  return useQuery<Awaited<ReturnType<TControllerAction>>, TError>(queryKey, queryFn, options?.query)
}
