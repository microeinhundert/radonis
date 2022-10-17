/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createContext } from 'react'

/**
 * @internal
 */
export const baseUrlContext = createContext<string | undefined>(undefined)

/**
 * @internal
 */
export const BaseUrlContextProvider = baseUrlContext.Provider
