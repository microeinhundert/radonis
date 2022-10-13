/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin } from '@microeinhundert/radonis'
import type { QueryClientConfig } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { createElement as h } from 'react'

import { QueryDehydrator } from './components/QueryDehydrator'
import { QueryHydrator } from './components/QueryHydrator'
import { getQueryClient } from './queryClient'

/**
 * Plugin for integrating {@link https://tanstack.com/query/v4 TanStack Query} with Radonis
 * @see https://radonis.vercel.app/docs/plugins/query
 */
export function queryPlugin(config?: QueryClientConfig) {
  const queryClient = getQueryClient(config)

  return definePlugin({
    name: 'query',
    environments: ['client', 'server'],
    beforeHydrate() {
      return (tree) => h(QueryClientProvider, { client: queryClient }, h(QueryHydrator, { children: tree }))
    },
    beforeRequest() {
      queryClient.clear()
    },
    beforeRender() {
      return (tree) => h(QueryClientProvider, { client: queryClient }, h(QueryDehydrator, { children: tree }))
    },
  })
}
