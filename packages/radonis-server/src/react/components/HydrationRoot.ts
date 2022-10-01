/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis-hydrate'
import { Children, createElement as h, isValidElement, useId } from 'react'

import { ServerException } from '../../exceptions/serverException'
import type { HydrationRootProps } from '../../types'
import { useAssetsManager } from '../hooks/internal/useAssetsManager'
import { useManifestManager } from '../hooks/internal/useManifestManager'

/**
 * The component for marking components for client-side hydration
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function HydrationRoot({ children, component: componentIdentifier, className, disabled }: HydrationRootProps) {
  const manifestManager = useManifestManager()
  const assetsManager = useAssetsManager()
  const { root: parentHydrationRootIdentifier } = useHydration()
  const hydrationRootIdentifier = useId()

  const component = Children.only(children)

  if (!isValidElement(component) || typeof component.type !== 'function') {
    throw ServerException.cannotHydrateComponent(componentIdentifier, hydrationRootIdentifier)
  }

  if (component.props.children) {
    throw ServerException.cannotHydrateComponentWithChildren(componentIdentifier, hydrationRootIdentifier)
  }

  if (disabled || parentHydrationRootIdentifier) {
    return h(
      'div',
      {
        className,
      },
      component
    )
  }

  /*
   * Register the props with the ManifestManager
   */
  const propsHash = manifestManager.registerProps(component.props)

  /*
   * Require the component on the AssetsManager
   */
  assetsManager.requireComponent(componentIdentifier)

  return h(
    HydrationContextProvider,
    {
      value: {
        hydrated: false,
        root: hydrationRootIdentifier,
        component: componentIdentifier,
        propsHash,
      },
    },
    h(
      'div',
      {
        className,
        'data-component': componentIdentifier,
        'data-hydration-root': hydrationRootIdentifier,
        'data-props': propsHash,
      },
      component
    )
  )
}

HydrationRoot.displayName = 'RadonisHydrationRoot'
