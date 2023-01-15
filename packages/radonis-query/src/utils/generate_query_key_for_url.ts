/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { urlToRelativePath } from '@microeinhundert/radonis-shared'
import type { QueryKey } from '@tanstack/react-query'

/**
 * Generate the query key for an URL
 */
export function generateQueryKeyForUrl(url: URL | string, prepend?: unknown[]): QueryKey {
  const internalUrl = new URL(url, 'http://internal')
  const urlQueryKey = urlToRelativePath(internalUrl).split('/')
  const queryKey = [prepend, urlQueryKey].flat()

  return queryKey
}
