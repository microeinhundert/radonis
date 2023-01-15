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

import { CannotInitClientMultipleTimesException } from './exceptions/cannot_init_client_multiple_times'
import { CannotInitClientOnServerException } from './exceptions/cannot_init_client_on_server'
import { hydrator, pluginsManager } from './singletons'
import type { ClientOptions } from './types/main'

let isClientInitialized = false

/**
 * Hydrate the page
 */
function hydrate() {
  startTransition(() => {
    hydrator.hydrateHydrationRoots()
  })
}

/**
 * Initialize the client
 */
export async function initClient(options?: ClientOptions): Promise<void> {
  if (isServer) {
    throw new CannotInitClientOnServerException()
  }
  if (isClientInitialized) {
    throw new CannotInitClientMultipleTimesException()
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
