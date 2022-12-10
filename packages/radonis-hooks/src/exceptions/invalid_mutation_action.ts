/*
 * @microeinhundert/radonis-hooks
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
export class InvalidMutationActionException extends RadonisException {
  constructor(mutationAction: string) {
    super(`Invalid mutation action "${mutationAction}"`, {
      status: 500,
      code: 'E_INVALID_MUTATION_ACTION',
    })
  }
}
