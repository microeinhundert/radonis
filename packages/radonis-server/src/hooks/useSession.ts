/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHttpContext } from './useHttpContext'

export function useSession() {
  const { session } = useHttpContext()

  if (!session) {
    throw new Error('The provider "@adonisjs/session" is not installed')
  }

  return session
}
