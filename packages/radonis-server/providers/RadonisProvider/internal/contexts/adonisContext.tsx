import type { AdonisContextContract } from '@ioc:Radonis';
import { createContext } from 'react';

export const adonisContext = createContext<AdonisContextContract>(null as any);

export const AdonisContextProvider = adonisContext.Provider;
