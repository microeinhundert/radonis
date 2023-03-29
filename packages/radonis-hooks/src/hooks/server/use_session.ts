/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_CANNOT_USE_ON_CLIENT } from '../../exceptions'
import { useHttpContext } from './use_http_context'

/**
 * Hook for retrieving the AdonisJS `SessionContract`
 * @see https://radonis.vercel.app/docs/hooks/use-session
 */
export function useSession() {
  try {
    const { session } = useHttpContext()

    return session
  } catch {
    throw new E_CANNOT_USE_ON_CLIENT(['useSession'])
  }
}
