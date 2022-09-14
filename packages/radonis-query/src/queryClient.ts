/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { QueryClientConfig } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'

/**
 * The current QueryClient
 */
let queryClient: QueryClient

/**
 * Get the QueryClient
 * @internal
 */
export function getQueryClient(config?: QueryClientConfig) {
  if (config) {
    queryClient = new QueryClient(config)
  }

  return (queryClient = queryClient ?? new QueryClient())
}
