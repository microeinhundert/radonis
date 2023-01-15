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
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { ServerMutationOptions } from '../types/main'
import { useQueryBaseUrl } from './use_query_base_url'

/**
 * Hook for mutating server data
 * @see https://radonis.vercel.app/docs/plugins/query#mutating-data
 */
export function useServerMutation<
  TControllerAction extends (ctx: HttpContextContract) => any,
  TError = unknown,
  TData = Awaited<ReturnType<TControllerAction>>
>(routeIdentifier: string, options?: ServerMutationOptions<TData, TError>) {
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

  const mutationFn = async (data) => {
    const response = await fetch$(url, {
      method: 'post',
      body: data,
      headers: options?.headers,
    })

    return response.json<any>()
  }

  return useMutation<TData, TError>({
    mutationFn,
    ...options?.mutation,
  })
}
