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
import { invariant, PluginsManager } from '@microeinhundert/radonis-shared'
import type { ComponentType } from 'react'

const pluginsManager = new PluginsManager()
const hydrationManager = new HydrationManager()

type ClientConfig = {
  plugins?: Plugin[]
}

let clientInitialized = false

export async function initClient(config?: ClientConfig): Promise<void> {
  invariant(
    !clientInitialized,
    'The Radonis client was initialized multiple times. Make sure to only initialize it once in your application'
  )

  if (config?.plugins?.length) {
    pluginsManager.install('client', ...config.plugins)
  }

  await pluginsManager.execute('onInitClient', null)
  hydrationManager.hydrateRoots()

  clientInitialized = true
}

export function registerComponentForHydration(identifier: string, Component: ComponentType): void {
  hydrationManager.registerComponent(identifier, Component)
}
