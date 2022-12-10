/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin, UrlBuilder } from '@microeinhundert/radonis'
import type { QueryClientConfig } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createElement as h } from 'react'

import { QueryDehydrator } from './components/query_dehydrator'
import { QueryHydrator } from './components/query_hydrator'
import { BaseUrlContextProvider } from './contexts/base_url_context'
import { getQueryClient } from './queryClient'
import { generateQueryKeyForUrl } from './utils/generate_query_key_for_url'
import { getRouteIdentifier } from './utils/get_route_identifier'

/**
 * Plugin for integrating {@link https://tanstack.com/query/v4 TanStack Query} with Radonis
 * @see https://radonis.vercel.app/docs/plugins/query
 */
export function queryPlugin(config?: QueryClientConfig & { baseUrl?: URL | string }) {
  const { baseUrl, ...queryClientConfig } = config ?? {}
  const queryClient = getQueryClient(queryClientConfig)

  return definePlugin({
    name: 'query',
    environments: ['client', 'server'],
    beforeHydrate() {
      return (tree) =>
        h(
          BaseUrlContextProvider,
          { value: baseUrl?.toString() || window.location.origin },
          h(QueryClientProvider, { client: queryClient }, h(QueryHydrator, { children: tree }))
        )
    },
    beforeRequest() {
      queryClient.clear()
    },
    beforeRender({ ctx, manifest, props }) {
      const host = ctx.request.header('host')
      const origin = host ? `https://${host}` : undefined
      const routeIdentifier = getRouteIdentifier(ctx.route)

      if (routeIdentifier && props) {
        const urlBuilder = new UrlBuilder(manifest.routes)
        const url = urlBuilder.make(routeIdentifier, { params: ctx.request.params(), queryParams: ctx.request.qs() })
        const queryKey = generateQueryKeyForUrl(url, [routeIdentifier])

        queryClient.setQueryData(queryKey, props)
      }

      return (tree) =>
        h(
          BaseUrlContextProvider,
          { value: baseUrl?.toString() || origin },
          h(QueryClientProvider, { client: queryClient }, h(QueryDehydrator, { children: tree }))
        )
    },
  })
}
