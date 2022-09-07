/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useAdonis } from './useAdonis'

/**
 * Hook for retrieving the AdonisJS `HttpContextContract`
 * @see {@link https://radonis.vercel.app/docs/hooks/use-http-context}
 */
export function useHttpContext() {
  const { httpContext } = useAdonis()

  return httpContext
}
