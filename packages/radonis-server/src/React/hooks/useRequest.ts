/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHttpContext } from './useHttpContext'

/**
 * Hook for retrieving the AdonisJS `RequestContract`
 * @see https://radonis.vercel.app/docs/hooks/use-request
 */
export function useRequest() {
  const { request } = useHttpContext()

  return request
}
