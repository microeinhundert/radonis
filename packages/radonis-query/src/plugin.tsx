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
      return (tree) => (
        <QueryClientProvider client={queryClient}>
          <QueryHydrator>{tree}</QueryHydrator>
        </QueryClientProvider>
      )
    },
    afterRequest() {
      queryClient.clear()
    },
    beforeRender() {
      return (tree) => <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
    },
  })
}
