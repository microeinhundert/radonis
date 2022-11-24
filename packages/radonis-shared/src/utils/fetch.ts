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

import superjson from "superjson";

import { getFetch } from "./get_fetch";

/**
 * Utility for fetching
 */
export async function fetch$(input: RequestInfo | URL, init?: RequestInit) {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      "Accept": "application/json",
      ...init?.headers,
      "X-Radonis-Request": "true",
    },
  };

  const fetchImpl = getFetch();
  const response = await fetchImpl(input, requestInit);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return {
    ...response,
    async json<T = unknown>() {
      const json = await response.json();

      /**
       * If the response was serialized by superjson,
       * deserialize it
       */
      if ("json" in json) {
        return superjson.deserialize<T>(json);
      }

      return json as T;
    },
  };
}
