/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { RouterContract } from '@ioc:Adonis/Core/Route'
import type { ComponentPropsWithoutRef, ComponentType, PropsWithoutRef } from 'react'

import type {
  ComponentIdentifier,
  ErrorPages,
  ExtractPluginHook,
  FlashMessageIdentifier,
  FlashMessages,
  FlushCallback,
  Globals,
  HeadMeta,
  HeadTag,
  Hydration,
  Locale,
  MessageIdentifier,
  Messages,
  PluginHooks,
  RenderOptions,
  Route,
  RouteIdentifier,
  Routes,
  UnwrapProps,
} from './'

/**
 * PluginsManager contract
 */
export interface PluginsManagerContract {
  onInitClientHooks: ExtractPluginHook<'onInitClient'>[]
  beforeHydrateHooks: ExtractPluginHook<'beforeHydrate'>[]
  onBootServerHooks: ExtractPluginHook<'onBootServer'>[]
  beforeRequestHooks: ExtractPluginHook<'beforeRequest'>[]
  afterRequestHooks: ExtractPluginHook<'afterRequest'>[]
  beforeRenderHooks: ExtractPluginHook<'beforeRender'>[]
  afterRenderHooks: ExtractPluginHook<'afterRender'>[]
  execute<
    TType extends keyof PluginHooks,
    TBuilderValue extends unknown,
    TParams extends Parameters<ExtractPluginHook<TType>>
  >(
    type: TType,
    initialBuilderValue: TBuilderValue,
    ...args: TParams
  ): Promise<TBuilderValue>
}

/**
 * HydrationManager contract
 */
export interface HydrationManagerContract {
  flashMessages: FlashMessages
  requiredFlashMessages: FlashMessages
  setFlashMessages(flashMessages: FlashMessages): this
  requireFlashMessage(identifier: '*' | 'errors.*' | FlashMessageIdentifier): this

  messages: Messages
  requiredMessages: Messages
  setMessages(messages: Messages): this
  requireMessage(identifier: '*' | MessageIdentifier): this

  routes: Routes
  requiredRoutes: Routes
  setRoutes(routes: Routes): this
  requireRoute(identifier: '*' | RouteIdentifier): this
}

/**
 * AssetsManager contract
 */
export interface AssetsManagerContract {
  requireComponent(identifier: ComponentIdentifier): void
}

/**
 * Manifest contract
 */
export interface ManifestContract {
  hydration: Hydration
  globals: Globals
  locale: Locale
  route: Route | null
  flashMessages: FlashMessages
  messages: Messages
  routes: Routes
}

/**
 *  ManifestManager contract
 */
export interface ManifestManagerContract extends ManifestContract {
  registerHydration(hydrationRootId: string, componentIdentifier: ComponentIdentifier, props: Record<string, any>): this
  addGlobals(globals: Globals): this
  setLocale(locale: Locale): this
  setRoute(route: Route): this
  setFlashMessages(flashMessages: FlashMessages): this
  setMessages(messages: Messages): this
  setRoutes(routes: Routes): this
}

/**
 * Renderer contract
 */
export interface RendererContract {
  withHeadTitle(title: string): RendererContract
  withHeadMeta(meta: HeadMeta): RendererContract
  withHeadTags(tags: HeadTag[]): RendererContract
  withGlobals(globals: Globals): RendererContract
  withErrorPages(errorPages: ErrorPages): RendererContract
  withFlushCallbacks(flushCallbacks: FlushCallback[]): RendererContract
  render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<UnwrapProps<T>>
}

/**
 * HeadManager contract
 */
export interface HeadManagerContract {
  setTitle(title: string): void
  addMeta(meta: HeadMeta): void
  addTags(tags: HeadTag[]): void
}

/**
 * Server contract
 */
export interface ServerContract {
  application: ApplicationContract
  httpContext: HttpContextContract
  router: RouterContract
}
