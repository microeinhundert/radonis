/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerContract } from '@microeinhundert/radonis-types'
import { createContext } from 'react'

export const serverContext = createContext<ServerContract>(null as any)

export const ServerContextProvider = serverContext.Provider
