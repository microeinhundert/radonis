/// <reference lib="dom" />

/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactElement } from 'react'
import type { RenderToReadableStreamOptions } from 'react-dom/server'
import { renderToReadableStream } from 'react-dom/server'
import { TransformStream } from 'stream/web'
import { TextDecoder, TextEncoder } from 'util'

import { nonNullable } from './utils/nonNullable'

export type RenderedReadableStream = ReadableStream<Uint8Array> & {
  allReady?: Promise<void> | undefined
}

export function encodeText(input: string) {
  return new TextEncoder().encode(input)
}

export function decodeText(input?: Uint8Array, textDecoder?: TextDecoder) {
  return textDecoder ? textDecoder.decode(input, { stream: true }) : new TextDecoder().decode(input)
}

export function createTransformStream(
  transform: (value: string) => string | Promise<string> = (value) => value
): TransformStream<Uint8Array, Uint8Array> {
  const textDecoder = new TextDecoder()

  return new TransformStream({
    async transform(chunk, controller) {
      const decoded = decodeText(chunk, textDecoder)
      const transformed = await transform(decoded)

      controller.enqueue(encodeText(transformed))
    },
    flush() {
      textDecoder.decode()
    },
  })
}

export function createFlushEffectStream(handleFlushEffect: () => string): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    transform(chunk, controller) {
      const flushedChunk = encodeText(handleFlushEffect())

      controller.enqueue(flushedChunk)
      controller.enqueue(chunk)
    },
  })
}

export function createHeadInjectionTransformStream(inject: () => string): TransformStream<Uint8Array, Uint8Array> {
  let injected = false
  return new TransformStream({
    transform(chunk, controller) {
      const content = decodeText(chunk)

      let index

      const headIndex = content.indexOf('</head')

      if (!injected && (index = headIndex) !== -1) {
        injected = true

        const injectedContent = content.slice(0, index) + inject() + content.slice(index)

        controller.enqueue(encodeText(injectedContent))
      } else {
        controller.enqueue(chunk)
      }
    },
  })
}

export function createInlineDataStream(
  dataStream: ReadableStream<Uint8Array>
): TransformStream<Uint8Array, Uint8Array> {
  let dataStreamFinished: Promise<void> | null = null

  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk)

      if (!dataStreamFinished) {
        const dataStreamReader = dataStream.getReader()

        dataStreamFinished = new Promise((resolve) => {
          setTimeout(async () => {
            try {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const { done, value } = await dataStreamReader.read()
                if (done) {
                  return resolve()
                }
                controller.enqueue(value)
              }
            } catch (error) {
              controller.error(error)
            }
            resolve()
          }, 0)
        })
      }
    },
    flush() {
      if (dataStreamFinished) {
        return dataStreamFinished
      }
    },
  })
}

export function renderToInitialStream({
  element,
  options,
}: {
  element: ReactElement
  options?: RenderToReadableStreamOptions
}): Promise<RenderedReadableStream> {
  return renderToReadableStream(element, options)
}

type ContinueFromInitialStreamOptions = {
  generateStaticHTML: boolean
  dataStream?: TransformStream<Uint8Array, Uint8Array>
  flushEffectHandler?: () => string
  flushDataStreamHandler?: () => void
  flushEffectsToHead: boolean
}

export async function continueFromInitialStream(
  renderStream: RenderedReadableStream,
  options: ContinueFromInitialStreamOptions
): Promise<ReadableStream<Uint8Array>> {
  const { generateStaticHTML, dataStream, flushEffectHandler, flushDataStreamHandler, flushEffectsToHead } = options

  /**
   * @see https://reactjs.org/docs/react-dom-server.html#rendertoreadablestream
   */
  if (generateStaticHTML && typeof renderStream.allReady !== 'undefined') {
    await renderStream.allReady
  }

  const transforms: Array<TransformStream<Uint8Array, Uint8Array>> = [
    createTransformStream(),

    /**
     * Just flush the effects to the queue if `flushEffectsToHead` is false.
     */
    flushEffectHandler && !flushEffectsToHead ? createFlushEffectStream(flushEffectHandler) : null,

    /**
     * Handles `useAsync` calls.
     */
    dataStream ? createInlineDataStream(dataStream.readable) : null,

    /**
     * Flush effects to the head if `flushEffectsToHead` is true.
     */
    createHeadInjectionTransformStream(() => {
      return flushEffectHandler && flushEffectsToHead ? flushEffectHandler() : ''
    }),
  ].filter(nonNullable)

  flushDataStreamHandler?.()

  return transforms.reduce((readable, transform) => readable.pipeThrough(transform), renderStream)
}
