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
import { Document } from '../components/Document'
import { CompilerContextProvider } from '../contexts/compilerContext'
import { HeadContextProvider } from '../contexts/headContext'
import { ManifestBuilderContextProvider } from '../contexts/manifestBuilderContext'
import { RadonisContextProvider } from '../contexts/radonisContext'

export function wrapWithDocument<T>(
  manifestBuilder: ManifestBuilder,
  compiler: Compiler,
  context: RadonisContextContract,
  Component: ComponentType<T>,
  props?: ComponentPropsWithoutRef<ComponentType<T>>
): ReactElement {
  return (
    <StrictMode>
      <ManifestBuilderContextProvider value={manifestBuilder}>
        <CompilerContextProvider value={compiler}>
          <RadonisContextProvider value={context}>
            <HeadContextProvider>
              <Document>
                {/* @ts-expect-error Unsure why this errors */}
                <Component {...(props ?? {})} />
              </Document>
            </HeadContextProvider>
          </RadonisContextProvider>
        </CompilerContextProvider>
      </ManifestBuilderContextProvider>
    </StrictMode>
  )
}
