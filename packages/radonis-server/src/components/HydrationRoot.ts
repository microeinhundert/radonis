/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useAssetsManager, useManifestManager } from '@microeinhundert/radonis-hooks'
import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis-hydrate'
import { Children, createElement as h, isValidElement, useId } from 'react'

import { ServerException } from '../exceptions/serverException'
import type { HydrationRootProps } from '../types'

/**
 * The component for marking components for client-side hydration
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function HydrationRoot({ children, component: componentIdentifier, className, disabled }: HydrationRootProps) {
  const manifestManager = useManifestManager()
  const assetsManager = useAssetsManager()
  const { id: parentHydrationRootId } = useHydration()
  const hydrationRootId = useId()

  const component = Children.only(children)

  if (!isValidElement(component) || typeof component.type !== 'function') {
    throw ServerException.cannotHydrateComponent(hydrationRootId, componentIdentifier)
  }

  if (component.props.children) {
    throw ServerException.cannotHydrateComponentWithChildren(hydrationRootId, componentIdentifier)
  }

  /*
   * Ignore if disabled or child of another HydrationRoot
   */
  if (disabled || parentHydrationRootId) {
    return h(
      'div',
      {
        className,
      },
      component
    )
  }

  /*
   * Register the hydration on the ManifestManager
   */
  manifestManager.registerHydration(hydrationRootId, componentIdentifier, component.props)

  /*
   * Require the component on the AssetsManager
   */
  assetsManager.requireComponent(componentIdentifier)

  return h(
    HydrationContextProvider,
    {
      value: {
        hydrated: false,
        id: hydrationRootId,
      },
    },
    h(
      'div',
      {
        className,
        'data-hydration-root': hydrationRootId,
      },
      component
    )
  )
}

HydrationRoot.displayName = 'RadonisHydrationRoot'
