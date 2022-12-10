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

import { CannotUseOnClientException } from '../../exceptions/cannot_use_on_client'

/**
 * Hook for retrieving the Radonis `ServerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-server
 */
export function useServer() {
  const context = useContext(serverContext)

  if (!context) {
    throw new CannotUseOnClientException('useServer')
  }

  return context
}
