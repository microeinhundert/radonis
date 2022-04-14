import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import { createContext } from 'react'

export const radonisContext = createContext<RadonisContextContract>(null as any)

export const RadonisContextProvider = radonisContext.Provider
