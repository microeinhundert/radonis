/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/unjs/ofetch/tree/main
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import superjson from 'superjson'

import { getFetchOrFail } from './get_fetch_or_fail'

/**
 * Helper to fetch from the Radonis server
 */
export async function radonisFetch(input: RequestInfo | URL, init?: RequestInit) {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      'Accept': 'application/json',
      ...init?.headers,
      'x-radonis-request': 'true',
    },
    body: init?.body?.constructor === Object ? superjson.stringify(init.body) : init?.body,
  }

  const fetchImpl = getFetchOrFail()
  const response = await fetchImpl(input, requestInit)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return {
    ...response,
    async json<T = unknown>() {
      const json = await response.json()

      /**
       * If the response is sent by Radonis,
       * deserialize it with superjson
       */
      if (response.headers.get('x-radonis-response') === 'true') {
        return superjson.deserialize<T>(json)
      }

      return json as T
    },
  }
}
