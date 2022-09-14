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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Plugin for adding asynchronous query utilities powered by {@link https://tanstack.com/query/v4 TanStack Query} to Radonis
 * @see {@link https://radonis.vercel.app/docs/plugins/query}
 */
export function queryPlugin(config?: QueryClientConfig) {
  let queryClient = new QueryClient(config)

  return definePlugin({
    name: 'query',
    environments: ['client', 'server'],
    beforeHydrate() {
      return (tree) => <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
    },
    beforeRender() {
      queryClient.clear()
      return (tree) => <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider>
    },
  })
}
