/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetsManifestEntry } from '@microeinhundert/radonis-build'
import { isClient, isServer, PluginsManager } from '@microeinhundert/radonis-shared'
import type {
  Components,
  FlashMessageIdentifier,
  MessageIdentifier,
  RouteIdentifier,
} from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrateException } from '../exceptions/hydrateException'
import { HydrationContextProvider } from '../react'
import { HYDRATION_ROOT_SELECTOR } from './constants'
import { getManifestOrFail } from './utils'

/**
 * @internal
 */
export class HydrationManager {
  /**
   * The singleton instance
   */
  static instance?: HydrationManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(): HydrationManager {
    return (HydrationManager.instance = HydrationManager.instance ?? new HydrationManager())
  }

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The components registered for hydration
   */
  #components: Components

  /**
   * Constructor
   */
  constructor() {
    this.#pluginsManager = PluginsManager.getSingletonInstance()
    this.#components = new Map()
  }

  /**
   * Hydrate a specific HydrationRoot
   */
  async #hydrateRoot(hydrationRoot: HTMLElement): Promise<void> {
    if (isServer) return

    const {
      hydrationRoot: hydrationRootIdentifier,
      component: componentIdentifier,
      props: propsHash = '0',
    } = hydrationRoot.dataset

    if (!hydrationRootIdentifier || !componentIdentifier) {
      throw HydrateException.missingHydrationData()
    }

    const Component = this.#components.get(componentIdentifier)

    if (!Component) {
      throw HydrateException.cannotHydrate(componentIdentifier, componentIdentifier)
    }

    const manifest = getManifestOrFail()

    const tree = await this.#pluginsManager.execute(
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
  #createRootObserver(): IntersectionObserver | undefined {
    if (isServer) return

    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach(async (observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        await this.#hydrateRoot(hydrationRoot)
        observer.unobserve(hydrationRoot)
      })
    })
  }

  /**
   * Hydrate the HydrationRoots
   */
  hydrateRoots(): this {
    if (isServer) return this

    const hydrationRoots = document.querySelectorAll(HYDRATION_ROOT_SELECTOR)
    const rootObserver = this.#createRootObserver()!

    for (const hydrationRoot of hydrationRoots) {
      rootObserver.observe(hydrationRoot)
    }

    return this
  }

  /**
   * Register a component
   */
  registerComponent(identifier: string, Component: ComponentType): this {
    if (isServer) return this

    if (this.#components.has(identifier)) {
      throw HydrateException.componentAlreadyRegistered(identifier)
    }

    this.#components.set(identifier, Component)

    return this
  }

  /**
   * Require a flash message for hydration
   */
  requireFlashMessageForHydration(identifier: '*' | 'errors.*' | FlashMessageIdentifier): this {
    if (isClient) return this

    const { FlashMessagesManager } = require('@microeinhundert/radonis-manifest')

    FlashMessagesManager.getSingletonInstance().requireFlashMessageForHydration(identifier)

    return this
  }

  /**
   * Require a message for hydration
   */
  requireMessageForHydration(identifier: '*' | MessageIdentifier): this {
    if (isClient) return this

    const { I18nManager } = require('@microeinhundert/radonis-manifest')

    I18nManager.getSingletonInstance().requireMessageForHydration(identifier)

    return this
  }

  /**
   * Require a route for hydration
   */
  requireRouteForHydration(identifier: '*' | RouteIdentifier): this {
    if (isClient) return this

    const { RoutesManager } = require('@microeinhundert/radonis-manifest')

    RoutesManager.getSingletonInstance().requireRouteForHydration(identifier)

    return this
  }

  /**
   * Require the flash messages, messages and routes
   * used by an asset for hydration
   */
  requireAssetForHydration(asset: AssetsManifestEntry): this {
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
}
