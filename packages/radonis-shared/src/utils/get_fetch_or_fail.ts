/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { E_MISSING_FETCH } from '../exceptions'

/**
 * Get the available `fetch` implementation or fail
 */
export function getFetchOrFail() {
  if (!globalThis.fetch) {
    throw new E_MISSING_FETCH()
  }

  return globalThis.fetch
}
