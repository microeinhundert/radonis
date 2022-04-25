/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { PluginsManager } from '@microeinhundert/radonis-shared'
import type { ComponentType } from 'react'

const pluginsManager = new PluginsManager()
const hydrationManager = new HydrationManager()

type ClientConfig = {
  plugins?: Radonis.Plugin[]
}

let clientInitialized = false

export function initClient(config?: ClientConfig) {
  if (clientInitialized) {
    throw new Error(
      'The Radonis client was initialized multiple times. Make sure to only initialize it once in your application'
    )
  }

  if (config?.plugins?.length) {
    pluginsManager.registerPlugins(...config.plugins).execute('onInitClient')
  }

  hydrationManager.hydrateRoots()
  clientInitialized = true
}

export function registerComponentForHydration(identifier: string, Component: ComponentType) {
  hydrationManager.registerComponent(identifier, Component)
}
