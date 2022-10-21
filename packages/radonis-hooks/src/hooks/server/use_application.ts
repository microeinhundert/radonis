/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HookException } from '../../exceptions/hook_exception'
import { useServer } from './use_server'

/**
 * Hook for retrieving the AdonisJS `ApplicationContract`
 * @see https://radonis.vercel.app/docs/hooks/use-application
 */
export function useApplication() {
  try {
    const { application } = useServer()

    return application
  } catch {
    throw HookException.cannotUseOnClient('useApplication')
  }
}
