/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { Plugin } from '@microeinhundert/radonis-shared'
import { invariant, isClient, isProduction, PluginsManager } from '@microeinhundert/radonis-shared'
import type { ComponentType } from 'react'

const pluginsManager = PluginsManager.getInstance()
const hydrationManager = HydrationManager.getInstance()

type ClientConfig = {
  plugins?: Plugin[]
}

let isClientInitialized = false

/**
 * Initialize the client
 */
export async function initClient(config?: ClientConfig): Promise<void> {
  invariant(
    isClient,
    'The Radonis client can only be initialized on the client. Make sure to only call "initClient" in the client bundle'
  )

  invariant(
    !isClientInitialized,
    'The Radonis client was initialized multiple times. Make sure to only initialize it once in your application'
  )

  if (config?.plugins?.length) {
    pluginsManager.install('client', ...config.plugins)
    await pluginsManager.execute('onInitClient', null, null)
  }

  hydrationManager.hydrateRoots()

  if (isProduction) {
    document.querySelector('#rad-manifest')?.remove()
  }

  isClientInitialized = true
}

/**
 * Imported by the Compiler to register components for hydration
 * @internal
 */
export function registerComponentForHydration(identifier: string, Component: ComponentType): void {
  hydrationManager.registerComponent(identifier, Component)
}
