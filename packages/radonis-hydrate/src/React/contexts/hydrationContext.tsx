/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'

export const hydrationContext = createContext<{
  hydrated: boolean
  root: string | null
  componentName: string | null
  propsHash: string | null
}>({
  hydrated: false,
  root: null,
  componentName: null,
  propsHash: null,
})

export const HydrationContextProvider = hydrationContext.Provider
