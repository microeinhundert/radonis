/*
 * @microeinhundert/radonis-hydrate
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
export class ComponentAlreadyRegisteredException extends RadonisException {
  constructor(componentIdentifier: string) {
    super(
      `The component "${componentIdentifier}" was already registered for hydration. Make sure to not use the same name for multiple components, regardless of which directory they are in`,
      {
        status: 500,
        code: 'E_COMPONENT_ALREADY_REGISTERED',
      }
    )
  }
}
