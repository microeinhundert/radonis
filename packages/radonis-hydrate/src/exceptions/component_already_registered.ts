/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate, RadonisException } from "@microeinhundert/radonis-shared";

import { E_COMPONENT_ALREADY_REGISTERED } from "../../exceptions.json";

/**
 * @internal
 */
export class ComponentAlreadyRegisteredException extends RadonisException {
  constructor(componentIdentifier: string) {
    super(
      interpolate(E_COMPONENT_ALREADY_REGISTERED.message, {
        componentIdentifier,
      }),
      E_COMPONENT_ALREADY_REGISTERED.status,
      E_COMPONENT_ALREADY_REGISTERED.code
    );
  }
}
