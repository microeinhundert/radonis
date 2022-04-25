/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'
import type { Twind, TxFunction } from 'twind'

export const twindContext = createContext<{ tw: Twind; tx: TxFunction }>(null as any)

export const TwindContextProvider = twindContext.Provider
