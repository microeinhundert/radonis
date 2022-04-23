/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { radonisContext } from '../contexts/radonisContext'

export function useRadonis() {
  const context = useContext(radonisContext)

  if (!context) {
    throw new Error(
      'You cannot use hooks from the "radonis-server" package on the client. Please make sure to only use hooks from the main "radonis" package inside of client-side hydrated components'
    )
  }

  return context
}
