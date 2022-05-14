/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HydrationRootProps } from '@ioc:Adonis/Addons/Radonis'
import { HydrationContextProvider, useHydration } from '@microeinhundert/radonis-hydrate'
import { invariant } from '@microeinhundert/radonis-shared'
import React, { useId } from 'react'

import { useCompiler } from '../hooks/useCompiler'
import { useManifestBuilder } from '../hooks/useManifestBuilder'

export function HydrationRoot({ children, component: componentIdentifier }: HydrationRootProps) {
  const manifestBuilder = useManifestBuilder()
  const compiler = useCompiler()
  const { root: parentHydrationRootId, componentIdentifier: parentComponentIdentifier } = useHydration()
  const hydrationRootId = useId()

  /*
   * Fail if the HydrationRoot is nested inside another HydrationRoot
   */
  invariant(
    !parentHydrationRootId,
    `Found HydrationRoot "${hydrationRootId}" for component "${componentIdentifier}" nested inside HydrationRoot "${parentHydrationRootId}" for component "${parentComponentIdentifier}".
    This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
  )

  const { props } = React.Children.only(children)

  /*
   * Register the props with the ManifestBuilder
   */
  const propsHash = manifestBuilder.registerProps(componentIdentifier, props)

  /*
   * Require the component for hydration on the Compiler
   */
  compiler.requireComponentForHydration(componentIdentifier)

  return (
    <HydrationContextProvider value={{ hydrated: false, root: hydrationRootId, componentIdentifier, propsHash }}>
      <div data-component={componentIdentifier} data-hydration-root={hydrationRootId} data-props={propsHash}>
        {children}
      </div>
    </HydrationContextProvider>
  )
}
