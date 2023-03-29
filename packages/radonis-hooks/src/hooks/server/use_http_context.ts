/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_CANNOT_USE_ON_CLIENT } from '../../exceptions'
import { useServer } from './use_server'

/**
 * Hook for retrieving the AdonisJS `HttpContextContract`
 * @see https://radonis.vercel.app/docs/hooks/use-http-context
 */
export function useHttpContext() {
  try {
    const { httpContext } = useServer()

    return httpContext
  } catch {
    throw new E_CANNOT_USE_ON_CLIENT(['useHttpContext'])
  }
}
