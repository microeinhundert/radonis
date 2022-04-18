/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import { createContext } from 'react'

export const radonisContext = createContext<RadonisContextContract>(null as any)

export const RadonisContextProvider = radonisContext.Provider
