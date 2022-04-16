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
    throw new Error('The "useTwind" hook does not work outside of Radonis rendered views')
  }

  return context
}
