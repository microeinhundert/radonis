/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'

import type { AssetsManager } from '../../assetsManager'

/**
 * @internal
 */
export const assetsManagerContext = createContext<AssetsManager>(null as any)

/**
 * @internal
 */
export const AssetsManagerContextProvider = assetsManagerContext.Provider