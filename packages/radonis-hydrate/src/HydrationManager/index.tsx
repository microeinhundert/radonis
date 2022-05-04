/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getManifestOrFail, isServer, PluginsManager } from '@microeinhundert/radonis-shared'
import type { ComponentType } from 'react'
import { StrictMode } from 'react'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import invariant from 'tiny-invariant'

import { HydrationContextProvider } from '../contexts/hydrationContext'
import { HYDRATION_ROOT_SELECTOR } from './constants'

export class HydrationManager {
  /**
   * The singleton instance
   */
  private static instance: HydrationManager

  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = new PluginsManager()

  /**
   * The components registered for hydration
   */
  private components: Record<string, ComponentType> = {}

  /**
   * Constructor
   */
  constructor() {
    if (HydrationManager.instance) {
      return HydrationManager.instance
    }

    HydrationManager.instance = this
  }

  /**
   * Hydrate a specific HydrationRoot
   */
  private hydrateRoot(hydrationRoot: HTMLElement): void {
    if (isServer) return

    const { hydrationRoot: hydrationRootId, component: componentName, props: propsHash = '0' } = hydrationRoot.dataset

    invariant(
      hydrationRootId && componentName,
      `Found a HydrationRoot that is missing required hydration data.
      Please make sure you passed all the required props to all of your HydrationRoots.
      If everything looks fine to you, this is most likely a bug of Radonis`
    )

    const Component = this.components[componentName]

    invariant(
      Component,
      `Found the server-rendered component "${componentName}" inside of HydrationRoot "${hydrationRootId}", but that component could not be hydrated.
      Please make sure the component "${componentName}" exists in the client bundle`
    )

    const manifest = getManifestOrFail()

    hydrateRoot(
      hydrationRoot,
      this.pluginsManager.executeHooks(
        'beforeRender',
        <StrictMode>
          <HydrationContextProvider value={{ hydrated: true, root: hydrationRootId, componentName, propsHash }}>
            <Component {...(manifest.props[propsHash] ?? {})} />
          </HydrationContextProvider>
        </StrictMode>
      )
    )
  }

  /**
   * Create the observer for observing the visibility of HydrationRoots
   */
  private createRootObserver(): IntersectionObserver | undefined {
    if (isServer) return

    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach((observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        this.hydrateRoot(hydrationRoot)
        observer.unobserve(hydrationRoot)
      })
    })
  }

  /**
   * Hydrate the HydrationRoots
   */
  public hydrateRoots(): this {
    if (isServer) return this

    const hydrationRoots = document.querySelectorAll(HYDRATION_ROOT_SELECTOR)
    const rootObserver = this.createRootObserver()!

    hydrationRoots.forEach((hydrationRoot: HTMLElement) => {
      rootObserver.observe(hydrationRoot)
    })

    return this
  }

  /**
   * Register a component
   */
  public registerComponent(identifier: string, Component: ComponentType): this {
    if (isServer) return this

    invariant(
      !(identifier in this.components),
      `The component "${identifier}" was already registered for hydration.
      Please make sure to not use the same name for multiple components`
    )

    this.components[identifier] = Component

    return this
  }

  /**
   * Require a flash message for hydration
   */
  public requireFlashMessageForHydration(identifier: string): this {
    if (!isServer) return this

    const { FlashMessagesManager } = require('@microeinhundert/radonis-manifest')

    new FlashMessagesManager().requireFlashMessageForHydration(identifier)

    return this
  }

  /**
   * Require a message for hydration
   */
  public requireMessageForHydration(identifier: string): this {
    if (!isServer) return this

    const { I18nManager } = require('@microeinhundert/radonis-manifest')

    new I18nManager().requireMessageForHydration(identifier)

    return this
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: string): this {
    if (!isServer) return this

    const { RoutesManager } = require('@microeinhundert/radonis-manifest')

    new RoutesManager().requireRouteForHydration(identifier)

    return this
  }

  /**
   * Require the flash messages, messages and routes
   * used by an asset for hydration
   */
  public requireAssetForHydration(asset: Radonis.AssetManifestEntry): this {
    if (!isServer || asset.type === 'entry') return this

    for (const identifier of asset.flashMessages) {
      this.requireFlashMessageForHydration(identifier)
    }

    for (const identifier of asset.messages) {
      this.requireMessageForHydration(identifier)
    }

    for (const identifier of asset.routes) {
      this.requireRouteForHydration(identifier)
    }

    return this
  }
}
