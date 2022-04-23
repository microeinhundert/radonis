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
import React, { useId } from 'react'

import { useCompiler } from '../hooks/useCompiler'
import { useManifestBuilder } from '../hooks/useManifestBuilder'

/*
 * Check if a data structure is serializable
 */
function isSerializable(data: unknown): boolean {
  try {
    JSON.stringify(data)
  } catch {
    return false
  }

  return true
}

export function HydrationRoot({ children, componentName }: HydrationRootProps) {
  const manifestBuilder = useManifestBuilder()
  const compiler = useCompiler()
  const { root: parentHydrationRootId, componentName: parentComponentName } = useHydration()
  const hydrationRootId = useId()

  /*
   * Throw if the HydrationRoot is nested inside another HydrationRoot
   */
  if (parentHydrationRootId) {
    throw new Error(
      `Found HydrationRoot "${hydrationRootId}" for component "${componentName}" nested inside HydrationRoot "${parentHydrationRootId}" for component "${parentComponentName}". This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    )
  }

  const { props } = React.Children.only(children)

  /*
   * Throw if the props are not serializable
   */
  if (!isSerializable(props)) {
    throw new Error(
      `The props passed to the component "${componentName}" inside HydrationRoot "${hydrationRootId}" are not serializable`
    )
  }

  /*
   * Register the props with the ManifestBuilder
   */
  const propsHash = manifestBuilder.registerProps(props)

  /*
   * Require the component for hydration on the Compiler
   */
  compiler.requireComponentForHydration(componentName)

  return (
    <HydrationContextProvider value={{ hydrated: false, root: hydrationRootId, componentName, propsHash }}>
      <div data-component={componentName} data-hydration-root={hydrationRootId} data-props={propsHash}>
        {children}
      </div>
    </HydrationContextProvider>
  )
}
