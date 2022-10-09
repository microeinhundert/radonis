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
import type { ManifestManager } from '../../manifestManager'
import { AdonisContextProvider } from '../contexts/adonisContext'
import { AssetsManagerContextProvider } from '../contexts/assetsManagerContext'
import { HydrationManagerContextProvider } from '../contexts/hydrationManagerContext'
import { ManifestManagerContextProvider } from '../contexts/manifestManagerContext'

/**
 * Wrap a React component with the required context providers
 * @internal
 */
export function withContextProviders<T>(
  hydrationManager: HydrationManager,
  assetsManager: AssetsManager,
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
        ManifestManagerContextProvider,
        { value: manifestManager } /* @ts-expect-error Unsure why this errors */,
        h(AdonisContextProvider, { value: adonisContext }, h(Component, props))
      )
    )
  )
}
