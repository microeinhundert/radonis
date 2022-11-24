/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { urlToRelativePath } from "@microeinhundert/radonis-shared";

/**
 * Generate the query key for an URL
 */
export function generateQueryKeyForUrl(url: URL | string, prepend?: string[]) {
  const internalUrl = new URL(url, "http://internal");
  const urlQueryKey = urlToRelativePath(internalUrl).split("/");
  const queryKey = [prepend, urlQueryKey].flat().filter(Boolean);

  return queryKey as string[];
}
