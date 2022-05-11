/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisContextContract } from '@ioc:Adonis/Addons/Radonis'
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import type { ComponentPropsWithoutRef, ComponentType, ReactElement } from 'react'
import React, { StrictMode } from 'react'

import type { Compiler } from '../../Compiler'
import type { HeadManager } from '../../HeadManager'
import { Document } from '../components/Document'
import { CompilerContextProvider } from '../contexts/compilerContext'
import { HeadManagerContextProvider } from '../contexts/headManagerContext'
import { ManifestBuilderContextProvider } from '../contexts/manifestBuilderContext'
import { RadonisContextProvider } from '../contexts/radonisContext'

export function wrapWithDocument<T>(
  compiler: Compiler,
  headManager: HeadManager,
  manifestBuilder: ManifestBuilder,
  context: RadonisContextContract,
  Component: ComponentType<T>,
  props?: ComponentPropsWithoutRef<ComponentType<T>>
): ReactElement {
  return (
    <StrictMode>
      <CompilerContextProvider value={compiler}>
        <HeadManagerContextProvider value={headManager}>
          <ManifestBuilderContextProvider value={manifestBuilder}>
            <RadonisContextProvider value={context}>
              <Document>
                {/* @ts-expect-error Unsure why this errors */}
                <Component {...(props ?? {})} />
              </Document>
            </RadonisContextProvider>
          </ManifestBuilderContextProvider>
        </HeadManagerContextProvider>
      </CompilerContextProvider>
    </StrictMode>
  )
}
