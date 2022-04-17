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

export function HydrationRoot({ children, componentName }: HydrationRootProps) {
  const manifestBuilder = useManifestBuilder()
  const compiler = useCompiler()
  const { root: parentHydrationRootId, componentName: parentComponentName } = useHydration()
  const hydrationRootId = useId()

  if (parentHydrationRootId) {
    /* eslint-disable prettier/prettier */
    throw new Error(
      `Found HydrationRoot "${hydrationRootId}" for component "${componentName}" nested
      inside HydrationRoot "${parentHydrationRootId}" for component "${parentComponentName}".
      This is not allowed, as each HydrationRoot acts as root for a React app when hydrated on the client`
    )
    /* eslint-enable prettier/prettier */
  }

  compiler.requireComponent(componentName)

  const propsHash = manifestBuilder.registerComponent(React.Children.only(children))

  return (
    <HydrationContextProvider value={{ hydrated: false, root: hydrationRootId, componentName, propsHash }}>
      <div data-component={componentName} data-hydration-root={hydrationRootId} data-props={propsHash}>
        {children}
      </div>
    </HydrationContextProvider>
  )
}
