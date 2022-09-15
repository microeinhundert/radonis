/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AdonisContextContract } from '@ioc:Microeinhundert/Radonis'
import type { Builder as ManifestBuilder } from '@microeinhundert/radonis-manifest'
import type { ComponentPropsWithoutRef, ComponentType, ReactElement } from 'react'

import type { AssetsManager } from '../../AssetsManager'
import type { HeadManager } from '../../HeadManager'
import { Document } from '../components/Document'
import { AdonisContextProvider } from '../contexts/adonisContext'
import { AssetsManagerContextProvider } from '../contexts/assetsManagerContext'
import { HeadManagerContextProvider } from '../contexts/headManagerContext'
import { ManifestBuilderContextProvider } from '../contexts/manifestBuilderContext'

/**
 * Wrap the React tree with providers as well as the document
 * @internal
 */
export function wrapTree<T>(
  assetsManager: AssetsManager,
  headManager: HeadManager,
  manifestBuilder: ManifestBuilder,
  adonisContext: AdonisContextContract,
  Component: ComponentType<T>,
  props?: ComponentPropsWithoutRef<ComponentType<T>>
): ReactElement {
  return (
    <AssetsManagerContextProvider value={assetsManager}>
      <HeadManagerContextProvider value={headManager}>
        <ManifestBuilderContextProvider value={manifestBuilder}>
          <AdonisContextProvider value={adonisContext}>
            <Document>
              {/* @ts-expect-error Unsure why this errors */}
              <Component {...(props ?? {})} />
            </Document>
          </AdonisContextProvider>
        </ManifestBuilderContextProvider>
      </HeadManagerContextProvider>
    </AssetsManagerContextProvider>
  )
}
