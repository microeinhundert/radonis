/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AvailableComponents, PropsHash } from '@microeinhundert/radonis-types'
import { createContext } from 'react'

/**
 * @internal
 */
export const hydrationContext = createContext<{
  hydrated: boolean
  root: string | null
  component: AvailableComponents['value'] | null
  propsHash: PropsHash | null
}>({
  hydrated: false,
  root: null,
  component: null,
  propsHash: null,
})

/**
 * @internal
 */
export const HydrationContextProvider = hydrationContext.Provider
