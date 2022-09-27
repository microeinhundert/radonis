/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis-hydrate'
import { Children, createElement as h, useId } from 'react'

import { ServerException } from '../../exceptions/serverException'
import type { HydrationRootProps } from '../../types'
import { useAssetsManager } from '../hooks/internal/useAssetsManager'
import { useManifestManager } from '../hooks/internal/useManifestManager'

/**
 * The component for drawing the line between parts of the page
 * that should and should not be hydrated client-side
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function HydrationRoot({ children, component: componentIdentifier, disabled }: HydrationRootProps) {
  const manifestManager = useManifestManager()
  const assetsManager = useAssetsManager()
  const { root: parentHydrationRootIdentifier, component: parentComponentIdentifier } = useHydration()
  const hydrationRootIdentifier = useId()

  if (disabled) {
    return children
  }

  /*
   * Fail if the HydrationRoot is nested inside another HydrationRoot
   */
  if (parentHydrationRootIdentifier) {
    throw ServerException.cannotNestHydrationRoot(
      hydrationRootIdentifier,
      componentIdentifier,
      parentHydrationRootIdentifier,
      parentComponentIdentifier ?? 'unknown'
    )
  }

  const { props } = Children.only(children)

  /*
   * Register the props with the ManifestManager
   */
  const propsHash = manifestManager.registerProps(props)

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
    [
      h(
        'div',
        {
          'data-component': componentIdentifier,
          'data-hydration-root': hydrationRootIdentifier,
          'data-props': propsHash,
        },
        children
      ),
    ]
  )
}

HydrationRoot.displayName = 'RadonisHydrationRoot'
