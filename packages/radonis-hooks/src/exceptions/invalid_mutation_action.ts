/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_INVALID_MUTATION_ACTION } from "../../exceptions.json";

/**
 * @internal
 */
export class InvalidMutationActionException extends RadonisException {
  constructor(mutationAction: string) {
    super(
      interpolate(E_INVALID_MUTATION_ACTION.message, {
        mutationAction,
      }),
      E_INVALID_MUTATION_ACTION.status,
      E_INVALID_MUTATION_ACTION.code
    );
  }
}
