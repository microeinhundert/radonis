/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { isServer } from '@microeinhundert/radonis-shared'
import { startTransition } from 'react'

import { ClientException } from './exceptions/client_exception'
import { hydrator, pluginsManager } from './singletons'
import type { ClientOptions } from './types'

let isClientInitialized = false

function hydrate() {
  startTransition(() => {
    hydrator.hydrateRoots()
  })
}

/**
 * Initialize the client
 */
export async function initClient(options?: ClientOptions): Promise<void> {
  if (isServer) {
    throw ClientException.cannotInitClientOnServer()
  }
  if (isClientInitialized) {
    throw ClientException.cannotInitClientMultipleTimes()
  }

  isClientInitialized = true

  if (options?.plugins?.length) {
    pluginsManager.install('client', ...options.plugins)
    await pluginsManager.execute('onInitClient', null, null)
  }

  if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate)
  } else {
    window.setTimeout(hydrate, 1)
  }
}
