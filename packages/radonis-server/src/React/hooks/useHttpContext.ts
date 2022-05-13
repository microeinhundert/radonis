/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useAdonis } from './useAdonis'

export function useHttpContext() {
  const { httpContext } = useAdonis()

  return httpContext
}
