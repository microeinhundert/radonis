/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'

import type { Compiler } from '../../Compiler'

export const compilerContext = createContext<Compiler>(null as any)

export const CompilerContextProvider = compilerContext.Provider
