/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HookException } from '../../exceptions/hook_exception'
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
    throw HookException.cannotUseOnClient('useSession')
  }
}
