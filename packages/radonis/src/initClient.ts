/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { hydrate } from '@microeinhundert/radonis-hydrate'
import { setup, twindConfig } from '@microeinhundert/radonis-twind'

export function initClient() {
  setup(twindConfig)

  return {
    hydrate,
  }
}
