/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'
import invariant from 'tiny-invariant'

import { twindContext } from '../contexts/twindContext'

export function useTwind() {
  const context = useContext(twindContext)

  invariant(
    context,
    `The "useTwind" hook requires the "TwindContextProvider" to be present in the component tree.
    Make sure the Twind plugin was registered on both client and server`
  )

  return context
}
