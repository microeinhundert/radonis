/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationManager } from '@microeinhundert/radonis-hydrate'
import { isProduction } from '@microeinhundert/radonis-shared'
import { install, twindConfig } from '@microeinhundert/radonis-twind'
import type { ComponentType } from 'react'

export function initClient() {
  install(twindConfig, isProduction)
  new HydrationManager().hydrateRoots()
}

export function registerComponentForHydration(identifier: string, Component: ComponentType) {
  new HydrationManager().registerComponent(identifier, Component)
}
