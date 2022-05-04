/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import { useContext } from 'react'

import { twindContext } from '../contexts/twindContext'

export function useTwind() {
  const context = useContext(twindContext)

  invariant(
    context,
    `The "useTwind" hook requires the "TwindContextProvider" to be present in the component tree.
    Please make sure the Twind plugin was registered on both the client and the server`
  )

  return context
}
