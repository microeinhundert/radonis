/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactNode } from 'react'
import React, { createContext } from 'react'
import type { Twind, TxFunction } from 'twind'
import { getSheet, twind, tx as tx$ } from 'twind'

import { twindConfig } from '../twindConfig'

const tw = /* @__PURE__ */ twind(twindConfig, getSheet(false))
const tx = /* @__PURE__ */ tx$.bind(tw)

export const twindContext = createContext<{ tw: Twind; tx: TxFunction }>(null as any)

export const TwindContextProvider = ({ children }: { children: ReactNode }) => {
  return <twindContext.Provider value={{ tw, tx }}>{children}</twindContext.Provider>
}
