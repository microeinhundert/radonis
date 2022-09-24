/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { twindContext } from '../contexts/twindContext'
import { TwindException } from '../exceptions/twindException'

/**
 * Hook for accessing Twind's `tw` as well as `tx`
 * @see https://radonis.vercel.app/docs/plugins/twind
 */
export function useTwind() {
  const context = useContext(twindContext)

  if (!context) {
    throw TwindException.contextUnavailable()
  }

  return context
}
