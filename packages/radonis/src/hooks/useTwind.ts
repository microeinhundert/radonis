/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { twindContext } from '../contexts/twindContext'

export function useTwind() {
  const context = useContext(twindContext)

  if (!context) {
    throw new Error(
      `You tried using the useTwind hook outside of a Radonis rendered view.
      This does not work`
    )
  }

  return context
}
