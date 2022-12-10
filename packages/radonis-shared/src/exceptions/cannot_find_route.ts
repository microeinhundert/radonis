/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '../exception/main'

/**
 * @internal
 */
export class CannotFindRouteException extends RadonisException {
  constructor(routeIdentifier: string) {
    super(
      `Cannot find route "${routeIdentifier}". Make sure the route exists and can be detected by static analysis, more on this on https://radonis.vercel.app/docs/compiler#static-analysis`,
      {
        status: 404,
        code: 'E_CANNOT_FIND_ROUTE',
      }
    )
  }
}
