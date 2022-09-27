/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { AssetsManifestEntry } from '@microeinhundert/radonis-build'
import type { PluginsManager } from '@microeinhundert/radonis-shared'
import { isClient } from '@microeinhundert/radonis-shared'
import type {
  Components,
  FlashMessageIdentifier,
  FlashMessages,
  MessageIdentifier,
  Messages,
  ResetBetweenRequests,
  RouteIdentifier,
  Routes,
} from '@microeinhundert/radonis-types'
import type { ComponentType } from 'react'
import { createElement as h, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrateException } from '../exceptions/hydrateException'
import { HydrationContextProvider } from '../react'
import { ERRORS_NAMESPACE, HYDRATION_ROOT_SELECTOR } from './constants'
import { getManifestOrFail } from './utils/getManifestOrFail'

/**
 * @internal
 */
export class HydrationManager implements ResetBetweenRequests {
  /**
   * The singleton instance
   */
  static instance?: HydrationManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...params: ConstructorParameters<typeof HydrationManager>): HydrationManager {
    return HydrationManager.instance ?? new HydrationManager(...params)
  }

  /**
   * The PluginsManager instance
   */
  #pluginsManager: PluginsManager

  /**
   * The flash messages
   */
  #flashMessages: FlashMessages

  /**
   * The required flash messages
   */
  #requiredFlashMessages: Set<FlashMessageIdentifier>

  /**
   * The messages
   */
  #messages: Messages

  /**
   * The required messages
   */
  #requiredMessages: Set<MessageIdentifier>

  /**
   * The routes
   */
  #routes: Routes

  /**
   * The required routes
   */
  #requiredRoutes: Set<RouteIdentifier>

  /**
   * The components
   */
  #components: Components

  /**
   * Constructor
   */
  constructor(pluginsManager: PluginsManager) {
    HydrationManager.instance = this

    this.#pluginsManager = pluginsManager

    this.#flashMessages = {}
    this.#requiredFlashMessages = new Set()

    this.#messages = {}
    this.#requiredMessages = new Set()

    this.#routes = {}
    this.#requiredRoutes = new Set()

    this.#components = new Map()
  }

  /**
   * The flash messages
   */
  get flashMessages(): FlashMessages {
    return this.#flashMessages
  }

  /**
   * The required flash messages
   */
  get requiredFlashMessages(): FlashMessages {
    const flashMessages = {} as FlashMessages

    for (const identifier of this.#requiredFlashMessages) {
      if (identifier in this.#flashMessages) {
        flashMessages[identifier] = this.#flashMessages[identifier]
      }
    }

    return flashMessages
  }

  /**
   * The messages
   */
  get messages(): Messages {
    return this.#messages
  }

  /**
   * The required messages
   */
  get requiredMessages(): Messages {
    const messages = {} as Messages

    for (const identifier of this.#requiredMessages) {
      if (identifier in this.#messages) {
        messages[identifier] = this.#messages[identifier]
      }
    }

    return messages
  }

  /**
   * The routes
   */
  get routes(): Routes {
    return this.#routes
  }

  /**
   * The required routes
   */
  get requiredRoutes(): Routes {
    const routes = {} as Routes

    for (const identifier of this.#requiredRoutes) {
      if (identifier in this.#routes) {
        routes[identifier] = this.#routes[identifier]
      }
    }

    return routes
  }

  /**
   * Require a flash message
   */
  requireFlashMessage(identifier: '*' | 'errors.*' | FlashMessageIdentifier): void {
    if (isClient) return

    if (identifier === '*') {
      /**
       * Require all flash messages
       */
      this.#requiredFlashMessages = new Set(Object.keys(this.#flashMessages))
    } else if (identifier === 'errors.*') {
      /**
       * Require all error flash messages
       */
      this.#requiredFlashMessages = new Set(
        Object.keys(this.#flashMessages).filter((key) => key.startsWith(`${ERRORS_NAMESPACE}.`))
      )
    } else if (identifier in this.#flashMessages) {
      this.#requiredFlashMessages.add(identifier)
    }
  }

  /**
   * Require a message
   */
  requireMessage(identifier: '*' | MessageIdentifier): void {
    if (isClient) return

    if (identifier === '*') {
      /**
       * Require all messages
       */
      this.#requiredMessages = new Set(Object.keys(this.#messages))
    } else if (identifier in this.#messages) {
      this.#requiredMessages.add(identifier)
    }
  }

  /**
   * Require a route
   */
  requireRoute(identifier: '*' | RouteIdentifier): void {
    if (isClient) return

    if (identifier === '*') {
      /**
       * Require all routes
       */
      this.#requiredRoutes = new Set(Object.keys(this.#routes))
    } else if (identifier in this.#routes) {
      this.#requiredRoutes.add(identifier)
    }
  }

  /**
   * Set the flash messages
   */
  setFlashMessages(flashMessages: FlashMessages): this {
    this.#flashMessages = flashMessages

    return this
  }

  /**
   * Set the messages
   */
  setMessages(messages: Messages): this {
    this.#messages = messages

    return this
  }

  /**
   * Set the routes
   */
  setRoutes(routes: Routes): this {
    this.#routes = routes

    return this
  }

  /**
   * Register a component
   */
  registerComponent(identifier: string, Component: ComponentType): this {
    if (this.#components.has(identifier)) {
      throw HydrateException.componentAlreadyRegistered(identifier)
    }

    this.#components.set(identifier, Component)

    return this
  }

  /**
   * Require the flash messages, messages and routes used by an
   */
  requireAsset(asset: AssetsManifestEntry): this {
    if (asset.type === 'entry') return this

    for (const identifier of asset.flashMessages) {
      this.requireFlashMessage(identifier)
    }

    for (const identifier of asset.messages) {
      this.requireMessage(identifier)
    }

    for (const identifier of asset.routes) {
      this.requireRoute(identifier)
    }

    return this
  }

  /**
   * Reset for a new request
   */
  resetForNewRequest(): void {
    this.#flashMessages = {}
    this.#requiredFlashMessages.clear()

    this.#messages = {}
    this.#requiredMessages.clear()

    this.#routes = {}
    this.#requiredRoutes.clear()

    this.#components.clear()
  }

  /**
   * Hydrate the HydrationRoots
   */
  hydrateRoots(): this {
    const hydrationRoots = document.querySelectorAll(HYDRATION_ROOT_SELECTOR)
    const rootObserver = this.#createRootObserver()!

    for (const hydrationRoot of hydrationRoots) {
      rootObserver.observe(hydrationRoot)
    }

    return this
  }

  /**
   * Hydrate a specific HydrationRoot
   */
  async #hydrateRoot(hydrationRoot: HTMLElement): Promise<void> {
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
      h(
        HydrationContextProvider,
        {
          value: {
            hydrated: true,
            root: hydrationRootIdentifier,
            component: componentIdentifier,
            propsHash,
          },
        },
        [h(Component, manifest.props[propsHash])]
      ),
      null
    )

    hydrateRoot(hydrationRoot, h(StrictMode, null, tree))
  }

  /**
   * Create the observer for observing the visibility of HydrationRoots
   */
  #createRootObserver(): IntersectionObserver | undefined {
    return new IntersectionObserver((observedHydrationRoots, observer) => {
      observedHydrationRoots.forEach(async (observedHydrationRoot) => {
        if (!observedHydrationRoot.isIntersecting) return

        const hydrationRoot = observedHydrationRoot.target as HTMLElement

        await this.#hydrateRoot(hydrationRoot)
        observer.unobserve(hydrationRoot)
      })
    })
  }
}
