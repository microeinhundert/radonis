/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createInternalURL, stripOriginFromURL } from '@microeinhundert/radonis-shared'
import type { QueryKey } from '@tanstack/react-query'

/**
 * Get the query key for an URL
 */
export function getQueryKeyForURL(url: URL | string, prepend?: unknown[]): QueryKey {
  const urlQueryKey = stripOriginFromURL(createInternalURL(url)).split('/')
  const queryKey = [prepend, urlQueryKey].flat()

  return queryKey
}
