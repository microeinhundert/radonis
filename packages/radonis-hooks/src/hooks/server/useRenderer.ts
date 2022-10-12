/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { rendererContext } from '../../contexts/rendererContext'
import { HookException } from '../../exceptions/hookException'

/**
 * Hook for retrieving the Radonis `Renderer` instance
 * @see https://radonis.vercel.app/docs/hooks/use-renderer
 */
export function useRenderer() {
  const context = useContext(rendererContext)

  if (!context) {
    throw HookException.cannotUseOnClient('useRenderer')
  }

  return context
}
