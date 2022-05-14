/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentIdentifier, PropsGroupHash } from '@microeinhundert/radonis-types'
import { createContext } from 'react'

export const hydrationContext = createContext<{
  hydrated: boolean
  root: string | null
  component: ComponentIdentifier | null
  propsHash: PropsGroupHash | null
}>({
  hydrated: false,
  root: null,
  component: null,
  propsHash: null,
})

export const HydrationContextProvider = hydrationContext.Provider
