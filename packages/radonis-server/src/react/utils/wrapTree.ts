/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AdonisContextContract } from '@ioc:Microeinhundert/Radonis'
import type { HydrationManager } from '@microeinhundert/radonis-hydrate'
import type { ComponentPropsWithoutRef, ComponentType, ReactElement } from 'react'
import { createElement as h } from 'react'

import type { AssetsManager } from '../../assetsManager'
import type { HeadManager } from '../../headManager'
import type { ManifestManager } from '../../manifestManager'
import { Document } from '../components/Document'
import { AdonisContextProvider } from '../contexts/adonisContext'
import { AssetsManagerContextProvider } from '../contexts/assetsManagerContext'
import { HeadManagerContextProvider } from '../contexts/headManagerContext'
import { HydrationManagerContextProvider } from '../contexts/hydrationManagerContext'
import { ManifestManagerContextProvider } from '../contexts/manifestManagerContext'

/**
 * Wrap the React tree with providers as well as the document
 * @internal
 */
export function wrapTree<T>(
  hydrationManager: HydrationManager,
  assetsManager: AssetsManager,
  headManager: HeadManager,
  manifestManager: ManifestManager,
  adonisContext: AdonisContextContract,
  Component: ComponentType<T>,
  props?: ComponentPropsWithoutRef<ComponentType<T>>
): ReactElement {
  return h(
    HydrationManagerContextProvider,
    { value: hydrationManager },
    h(
      AssetsManagerContextProvider,
      { value: assetsManager },
      h(
        HeadManagerContextProvider,
        { value: headManager },
        h(
          ManifestManagerContextProvider,
          { value: manifestManager } /* @ts-expect-error Unsure why this errors */,
          h(AdonisContextProvider, { value: adonisContext }, h(Document, null, h(Component, props)))
        )
      )
    )
  )
}
