/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { assetsManagerContext } from '@microeinhundert/radonis-server/standalone'
import { useContext } from 'react'

import { E_CANNOT_USE_ON_CLIENT } from '../../exceptions'

/**
 * Hook for retrieving the Radonis `AssetsManagerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-assets-manager
 */
export function useAssetsManager() {
  const context = useContext(assetsManagerContext)

  if (!context) {
    throw new E_CANNOT_USE_ON_CLIENT(['useAssetsManager'])
  }

  return context
}
