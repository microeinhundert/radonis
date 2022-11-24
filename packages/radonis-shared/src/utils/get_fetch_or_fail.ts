/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MissingFetchException } from "../exceptions/missing_fetch";

/**
 * Get the available `fetch` implementation or fail
 */
export function getFetchOrFail() {
  if (!globalThis.fetch) {
    throw new MissingFetchException();
  }

  return globalThis.fetch;
}
