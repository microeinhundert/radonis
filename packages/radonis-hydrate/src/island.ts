/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentType } from 'react'

import { islandIdentifierSymbol } from './symbols'

/**
 * Make a component an island
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function island<T extends ComponentType<any>>(islandIdentifier: string, Component: T): T {
  Component[islandIdentifierSymbol] = islandIdentifier

  return Component
}
