/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { manifestManagerContext } from '@microeinhundert/radonis-server/standalone'
import { useContext } from 'react'

import { HookException } from '../../exceptions/hook_exception'

/**
 * Hook for retrieving the Radonis `ManifestManagerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-manifest-manager
 */
export function useManifestManager() {
  const context = useContext(manifestManagerContext)

  if (!context) {
    throw HookException.cannotUseOnClient('useManifestManager')
  }

  return context
}
