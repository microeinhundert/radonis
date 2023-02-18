/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { serverContext } from '@microeinhundert/radonis-server/standalone'
import { useContext } from 'react'

import { E_CANNOT_USE_ON_CLIENT } from '../../exceptions'

/**
 * Hook for retrieving the Radonis `ServerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-server
 */
export function useServer() {
  const context = useContext(serverContext)

  if (!context) {
    throw new E_CANNOT_USE_ON_CLIENT(['useServer'])
  }

  return context
}
