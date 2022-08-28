/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis-hydrate'
import { invariant } from '@microeinhundert/radonis-shared'
import { Children, useId } from 'react'

import type { HydrationRootProps } from '../../types'
import { useAssetsManager } from '../hooks/internal/useAssetsManager'
import { useManifestBuilder } from '../hooks/internal/useManifestBuilder'

export function HydrationRoot({ children, component: componentIdentifier, disabled }: HydrationRootProps) {
  const manifestBuilder = useManifestBuilder()
  const assetsManager = useAssetsManager()
  const { root: parentHydrationRootIdentifier, component: parentComponentIdentifier } = useHydration()
  const hydrationRootIdentifier = useId()

  if (disabled) {
    return children
  }

  /*
   * Fail if the HydrationRoot is nested inside another HydrationRoot
   */
  invariant(
    !parentHydrationRootIdentifier,
    `Found HydrationRoot "${hydrationRootIdentifier}" for component "${componentIdentifier}" nested inside HydrationRoot "${parentHydrationRootIdentifier}" for component "${parentComponentIdentifier}".
    This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
  )

  const { props } = Children.only(children)

  /*
   * Register the props with the ManifestBuilder
   */
  const propsHash = manifestBuilder.registerProps(componentIdentifier, props)

  /*
   * Require the component for hydration on the AssetsManager
   */
  assetsManager.requireComponentForHydration(componentIdentifier)

  return (
    <HydrationContextProvider
      value={{ hydrated: false, root: hydrationRootIdentifier, component: componentIdentifier, propsHash }}
    >
      <div data-component={componentIdentifier} data-hydration-root={hydrationRootIdentifier} data-props={propsHash}>
        {children}
      </div>
    </HydrationContextProvider>
  )
}
