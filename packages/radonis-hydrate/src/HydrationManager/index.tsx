/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant, isClient, isServer, PluginsManager } from '@microeinhundert/radonis-shared'
import type {
  AssetsManifestEntry,
  Components,
  FlashMessageIdentifier,
  MessageIdentifier,
  RouteIdentifier,
} from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { StrictMode } from 'react'
import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrationContextProvider } from '../React'
import { HYDRATION_ROOT_SELECTOR } from './constants'
import { getManifestOrFail } from './utils'

export class HydrationManager {
  /**
   * The singleton instance
   */
  private static instance?: HydrationManager

  /**
   * The PluginsManager instance
   */
  private pluginsManager: PluginsManager = PluginsManager.getInstance()

  /**
   * The components registered for hydration
   */
  private components: Components = new Map()

  /**
   * Hydrate a specific HydrationRoot
   */
  private async hydrateRoot(hydrationRoot: HTMLElement): Promise<void> {
    if (isServer) return

    const {
      hydrationRoot: hydrationRootIdentifier,
      component: componentIdentifier,
      props: propsHash = '0',
    } = hydrationRoot.dataset

    invariant(
      hydrationRootIdentifier && componentIdentifier,
      `Found a HydrationRoot that is missing required hydration data.
      Please make sure you passed all the required props to all of your HydrationRoots.
      If everything looks fine to you, this is most likely a bug of Radonis`
    )

    const Component = this.components.get(componentIdentifier)

    invariant(
      Component,
      `Found the server-rendered component "${componentIdentifier}" inside of HydrationRoot "${hydrationRootIdentifier}", but that component could not be hydrated.
      Please make sure the component "${componentIdentifier}" exists in the client bundle`
    )

    const manifest = getManifestOrFail()

    const tree = await this.pluginsManager.execute(
      'beforeHydrate',
      <HydrationContextProvider
        value={{ hydrated: true, root: hydrationRootIdentifier, component: componentIdentifier, propsHash }}
      >
        <Component {...(manifest.props[propsHash] ?? {})} />
      </HydrationContextProvider>,
      null
    )

    hydrateRoot(hydrationRoot, <StrictMode>{tree}</StrictMode>)
  }

  /**
   * Create the observer for observing the visibility of HydrationRoots
   */
  private createRootObserver(): IntersectionObserver | undefined {
    if (isServer) return

    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach(async (observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        await this.hydrateRoot(hydrationRoot)
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
      !this.components.has(identifier),
      `The component "${identifier}" was already registered for hydration.
      Please make sure to not use the same name for multiple components`
    )

    this.components.set(identifier, Component)

    return this
  }

  /**
   * Require a flash message for hydration
   */
  public requireFlashMessageForHydration(identifier: '*' | 'errors.*' | FlashMessageIdentifier): this {
    if (isClient) return this

    const { FlashMessagesManager } = require('@microeinhundert/radonis-manifest')

    FlashMessagesManager.getInstance().requireFlashMessageForHydration(identifier)

    return this
  }

  /**
   * Require a message for hydration
   */
  public requireMessageForHydration(identifier: '*' | MessageIdentifier): this {
    if (isClient) return this

    const { I18nManager } = require('@microeinhundert/radonis-manifest')

    I18nManager.getInstance().requireMessageForHydration(identifier)

    return this
  }

  /**
   * Require a route for hydration
   */
  public requireRouteForHydration(identifier: '*' | RouteIdentifier): this {
    if (isClient) return this

    const { RoutesManager } = require('@microeinhundert/radonis-manifest')

    RoutesManager.getInstance().requireRouteForHydration(identifier)

    return this
  }

  /**
   * Require the flash messages, messages and routes
   * used by an asset for hydration
   */
  public requireAssetForHydration(asset: AssetsManifestEntry): this {
    if (isClient || asset.type === 'entry') return this

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

  /**
   * Get the singleton instance
   */
  public static getInstance(): HydrationManager {
    return (HydrationManager.instance = HydrationManager.instance ?? new HydrationManager())
  }
}
