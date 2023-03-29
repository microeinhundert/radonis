/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRoute } from './use_route'

/**
 * Hook for retrieving the search params of the current route
 * @see https://radonis.vercel.app/docs/hooks/use-search-params
 */
export function useSearchParams() {
  const { current } = useRoute()

  return current.searchParams
}
