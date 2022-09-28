/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Plugin } from '@microeinhundert/radonis-shared'
import { isProduction, isServer } from '@microeinhundert/radonis-shared'
import type { ComponentType } from 'react'

import { ClientException } from './exceptions/clientException'
import { hydrator, pluginsManager } from './singletons'

type ClientConfig = {
  plugins?: Plugin[]
}

let isClientInitialized = false

/**
 * Initialize the client
 */
export async function initClient(config?: ClientConfig): Promise<void> {
  if (isServer) {
    throw ClientException.cannotInitClientOnServer()
  }
  if (isClientInitialized) {
    throw ClientException.cannotInitClientMultipleTimes()
  }

  isClientInitialized = true

  if (config?.plugins?.length) {
    pluginsManager.install('client', ...config.plugins)
    await pluginsManager.execute('onInitClient', null, null)
  }

  hydrator.hydrateRoots()

  if (isProduction) {
    document.querySelector('#rad-manifest')?.remove()
  }
}

/**
 * Imported by the Compiler to register components for hydration
 * @internal
 */
export function registerComponentForHydration(identifier: string, Component: ComponentType): void {
  hydrator.registerComponent(identifier, Component)
}
