/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AdonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import type { ComponentPropsWithoutRef, ComponentType, ReactElement } from 'react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import type { Compiler } from '../../Compiler'
import type { HeadManager } from '../../HeadManager'
import { Document } from '../components/Document'
import { AdonisContextProvider } from '../contexts/adonisContext'
import { CompilerContextProvider } from '../contexts/compilerContext'
import { HeadManagerContextProvider } from '../contexts/headManagerContext'
import { ManifestBuilderContextProvider } from '../contexts/manifestBuilderContext'

export function wrapWithDocument<T>(
  compiler: Compiler,
  headManager: HeadManager,
  manifestBuilder: ManifestBuilder,
  context: AdonisContextContract,
  Component: ComponentType<T>,
  props?: ComponentPropsWithoutRef<ComponentType<T>>
): ReactElement {
  const queryClient = new QueryClient()

  return (
    <CompilerContextProvider value={compiler}>
      <HeadManagerContextProvider value={headManager}>
        <ManifestBuilderContextProvider value={manifestBuilder}>
          <AdonisContextProvider value={context}>
            <QueryClientProvider client={queryClient}>
              <Document>
                {/* @ts-expect-error Unsure why this errors */}
                <Component {...(props ?? {})} />
              </Document>
            </QueryClientProvider>
          </AdonisContextProvider>
        </ManifestBuilderContextProvider>
      </HeadManagerContextProvider>
    </CompilerContextProvider>
  )
}
