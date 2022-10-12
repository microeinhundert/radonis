/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { assetsManagerContext } from '../../contexts/assetsManagerContext'
import { HookException } from '../../exceptions/hookException'

/**
 * Hook for retrieving the Radonis `AssetsManager` instance
 * @see https://radonis.vercel.app/docs/hooks/use-assets-manager
 */
export function useAssetsManager() {
  const context = useContext(assetsManagerContext)

  if (!context) {
    throw HookException.cannotUseOnClient('useAssetsManager')
  }

  return context
}
