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
import Minipass from 'minipass'
import type { ReactNode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'

/**
 * @internal
 */
export async function* generateHtmlStream({
  head,
  body,
  footer,
}: {
  head: () => string
  body: () => Promise<Minipass<Buffer, ContiguousData>>
  footer: () => string
}) {
  yield head()

  if (body) {
    for await (const chunk of await body()) {
      yield chunk
    }
  }

  yield footer()
}

/**
 * Helper function to get an AsyncIterable (via Minipass)
 * from the `renderToPipeableStream` `onShellReady` event
 * @internal
 */
export function onShellReady(tree: ReactNode) {
  const duplex = new Minipass()

  return new Promise<Minipass<Buffer, ContiguousData>>((resolve, reject) => {
    try {
      const pipeable = renderToPipeableStream(tree, {
        onShellReady() {
          resolve(pipeable.pipe(duplex))
        },
        onShellError: (error) => {
          pipeable.abort()
          reject(error)
        },
        onError: (error) => {
          pipeable.abort()
          reject(error)
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Helper function to get an AsyncIterable (via Minipass)
 * from the `renderToPipeableStream` `onAllReady` event
 * @internal
 */
export function onAllReady(tree: ReactNode) {
  const duplex = new Minipass()

  return new Promise<Minipass<Buffer, ContiguousData>>((resolve, reject) => {
    try {
      const pipeable = renderToPipeableStream(tree, {
        onAllReady() {
          resolve(pipeable.pipe(duplex))
        },
        onShellError: (error) => {
          pipeable.abort()
          reject(error)
        },
        onError: (error) => {
          pipeable.abort()
          reject(error)
        },
      })
    } catch (error) {
      reject(error)
    }
  })
}
