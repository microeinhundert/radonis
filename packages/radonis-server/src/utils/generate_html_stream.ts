/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * Adapted from https://github.com/fastify/fastify-dx
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContiguousData } from 'minipass'
import type Minipass from 'minipass'

/**
 * @internal
 */
export async function* generateHtmlStream({
  head,
  body,
  footer,
}: {
  head: () => string
  body: () => Minipass<Buffer, ContiguousData>
  footer: () => Promise<string>
}) {
  yield head()

  if (body) {
    for await (const chunk of await body()) {
      yield chunk
    }
  }

  yield await footer()
}
