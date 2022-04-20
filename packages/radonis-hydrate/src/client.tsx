/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getManifestOrFail, isServer } from '@microeinhundert/radonis-shared'
import { TwindContextProvider } from '@microeinhundert/radonis-twind'
import type { LazyExoticComponent } from 'react'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrationContextProvider } from './contexts/hydrationContext'

/**
 * Create the intersection observer that hydrates components only when in view
 */
function createIntersectionObserver(components: Record<string, LazyExoticComponent<any>>): IntersectionObserver {
  return new IntersectionObserver((observedHydrationRoots, observer) => {
    observedHydrationRoots.forEach((observedHydrationRoot) => {
      if (!observedHydrationRoot.isIntersecting) return

      const hydrationRootTarget = observedHydrationRoot.target as HTMLElement

      const hydrationRoot = hydrationRootTarget.dataset.hydrationRoot
      const componentName = hydrationRootTarget.dataset.component

      if (!hydrationRoot || !componentName) {
        throw new Error(
          `Found a HydrationRoot that is missing important hydration data.
          Please make sure you passed all the required props to all of your HydrationRoots.
          If everything looks fine to you, this is most likely a bug of Radonis`
        )
      }

      const Component = components[componentName]

      if (!Component) {
        throw new Error(
          `Found the server-rendered component "${componentName}" inside of HydrationRoot "${hydrationRoot}", but that component could not be hydrated.
          Please make sure the name under which the component was passed to "hydrate" matches the "componentName" prop passed to the HydrationRoot`
        )
      }

      const manifest = getManifestOrFail()

      const propsHash = hydrationRootTarget.dataset.props ?? '0'
      const props = manifest.props[propsHash] ?? {}

      hydrateRoot(
        hydrationRootTarget,
        <HydrationContextProvider value={{ hydrated: true, root: hydrationRoot, componentName, propsHash }}>
          <TwindContextProvider>
            <Component {...props} />
          </TwindContextProvider>
        </HydrationContextProvider>
      )
      observer.unobserve(hydrationRootTarget)
    })
  })
}

/**
 * Hydrate the server-rendered components on the client
 */
export function hydrate(components: Record<string, LazyExoticComponent<any>>): void {
  if (isServer) {
    throw new Error(
      `Radonis hydration does not work server-side.
      Please make sure "hydrate" is only called client-side`
    )
  }

  const hydrationRoots = document.querySelectorAll('[data-hydration-root]')
  const intersectionObserver = createIntersectionObserver(components)

  hydrationRoots.forEach((hydrationRoot: HTMLElement) => {
    intersectionObserver.observe(hydrationRoot)
  })
}
