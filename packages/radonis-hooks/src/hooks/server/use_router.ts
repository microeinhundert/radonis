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
 * Hook for retrieving the AdonisJS `RouterContract`
 * @see https://radonis.vercel.app/docs/hooks/use-router
 */
export function useRouter() {
  try {
    const { router } = useServer()

    return router
  } catch {
    throw new E_CANNOT_USE_ON_CLIENT(['useRouter'])
  }
}
