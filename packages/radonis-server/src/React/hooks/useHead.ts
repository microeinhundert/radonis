/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '@microeinhundert/radonis-shared'
import { useContext } from 'react'

import { HeadActionType, headContext } from '../contexts/headContext'

export function useHead() {
  const context = useContext(headContext)

  invariant(
    context,
    `You cannot use hooks from the "radonis-server" package on the client.
    Please make sure to only use hooks from the main "radonis" package inside of client-side hydrated components`
  )

  const { dispatchData } = context

  return {
    addMeta: (meta: Radonis.HTMLMetaDescriptor) => {
      dispatchData({ type: HeadActionType.AddMeta, payload: meta })
    },
  }
}
