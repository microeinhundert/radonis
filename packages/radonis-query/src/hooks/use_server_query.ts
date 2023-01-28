/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { useUrlBuilder } from '@microeinhundert/radonis'
import { fetch$ } from '@microeinhundert/radonis-shared'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { ServerQueryOptions } from '../types/main'
import { getQueryKeyForURL } from '../utils/get_query_key_for_url'
import { useQueryBaseUrl } from './use_query_base_url'

/**
 * Hook for querying server data
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useServerQuery<
  TControllerAction extends (ctx: HttpContextContract) => any,
  TError = unknown,
  TData = Awaited<ReturnType<TControllerAction>>
>(routeIdentifier: string, options?: ServerQueryOptions<TData, TError>) {
  const urlBuilder = useUrlBuilder()
  const baseUrl = useQueryBaseUrl()

  const url = useMemo(
    () =>
      urlBuilder.make(routeIdentifier, {
        baseUrl,
        params: options?.params,
        queryParams: options?.queryParams,
      }),
    [urlBuilder, routeIdentifier, baseUrl, options]
  )

  const queryFn = async () => {
    const response = await fetch$(url, {
      headers: options?.headers,
    })

    return response.json<any>()
  }

  return useQuery<TData, TError>({
    queryFn,
    ...options?.query,
    queryKey: getQueryKeyForURL(url, [routeIdentifier, options?.query?.queryKey]),
  })
}
