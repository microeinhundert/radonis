/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetsManagerContract } from '@microeinhundert/radonis-types'
import { createContext } from 'react'

/**
 * @internal
 */
export const assetsManagerContext = createContext<AssetsManagerContract>(null as any)

/**
 * @internal
 */
export const AssetsManagerContextProvider = assetsManagerContext.Provider
