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
  AssetsManifest,
  AssetsManifestEntry,
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
  Plugin,
  PluginEnvironment,
  PluginHooks,
  RenderOptions,
  Resettable,
  Route,
  RouteIdentifier,
  Routes,
  UnwrapProps,
} from './'

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
 * Server contract
 */
export interface ServerContract {
  application: ApplicationContract
  httpContext: HttpContextContract
  router: RouterContract
}

/**
 * AssetsManager contract
 */
export interface AssetsManagerContract extends Resettable {
  requiredAssets: AssetsManifest
  requireComponent(identifier: ComponentIdentifier): void
  readBuildManifest(): Promise<void>
}

/**
 * HeadManager contract
 */
export interface HeadManagerContract extends Resettable {
  setTitle(title: string): void
  addMeta(meta: HeadMeta): void
  addTags(tags: HeadTag[]): void
  getMarkup(): string
}

/**
 * HydrationManager contract
 */
export interface HydrationManagerContract extends Resettable {
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

  requireAsset(asset: AssetsManifestEntry): this
}

/**
 *  ManifestManager contract
 */
export interface ManifestManagerContract extends Resettable {
  hydration: Hydration
  globals: Globals
  locale: Locale
  route: Route | null
  flashMessages: FlashMessages
  messages: Messages
  routes: Routes

  registerHydration(hydrationRootId: string, componentIdentifier: ComponentIdentifier, props: Record<string, any>): this
  addGlobals(globals: Globals): this
  setLocale(locale: Locale): this
  setRoute(route: Route): this
  setFlashMessages(flashMessages: FlashMessages): this
  setMessages(messages: Messages): this
  setRoutes(routes: Routes): this

  getClientManifestAsJSON(): string
  setServerManifestOnGlobalScope(): void
}

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
  install(targetEnvironment: PluginEnvironment, ...plugins: Plugin[]): void
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
 * Renderer contract
 */
export interface RendererContract extends Resettable {
  withHeadTitle(title: string): this
  withHeadMeta(meta: HeadMeta): this
  withHeadTags(tags: HeadTag[]): this
  withGlobals(globals: Globals): this
  withErrorPages(errorPages: ErrorPages): this
  withFlushCallbacks(flushCallbacks: FlushCallback[]): this
  getForRequest(httpContext: HttpContextContract): this
  render<T extends PropsWithoutRef<any>>(
    Component: ComponentType<T>,
    props?: ComponentPropsWithoutRef<ComponentType<T>>,
    options?: RenderOptions
  ): Promise<UnwrapProps<T>>
}
