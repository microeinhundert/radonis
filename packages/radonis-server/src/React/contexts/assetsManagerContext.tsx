/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'

import type { AssetsManager } from '../../AssetsManager'

export const assetsManagerContext = createContext<AssetsManager>(null as any)

export const AssetsManagerContextProvider = assetsManagerContext.Provider
