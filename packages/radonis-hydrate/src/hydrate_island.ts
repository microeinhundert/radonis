/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentType } from 'react'

import { hydrator } from './singletons'

/**
 * Hydrate an island (injected by the compiler)
 * @internal
 */
export function hydrateIsland<T extends ComponentType<any>>(islandIdentifier: string, Component: T): T {
  hydrator.registerIsland(islandIdentifier, Component)

  return Component
}
