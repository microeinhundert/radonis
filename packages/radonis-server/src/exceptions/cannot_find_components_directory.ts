/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RadonisException } from '@microeinhundert/radonis-shared'

/**
 * @internal
 */
export class CannotFindComponentsDirectoryException extends RadonisException {
  constructor(path: string) {
    super(`The Radonis components directory could not be found at "${path}"`, {
      status: 404,
      code: 'E_CANNOT_FIND_COMPONENTS_DIRECTORY',
    })
  }
}
