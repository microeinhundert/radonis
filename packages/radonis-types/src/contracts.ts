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
  Asset,
  AssetsManifest,
  ErrorPages,
  FlushCallback,
  Globals,
  HeadMeta,
  HeadTag,
  Hydration,
  Plugin,
  PluginEnvironment,
  PluginHook,
  PluginHooks,
  RenderOptions,
  Resettable,
  Route,
  UnwrapProps,
} from '..'

/**
 * Manifest contract
 */
export interface ManifestContract {
  hydration: Hydration
  globals: Globals
  locale: string
  route: Route | null
  flashMessages: Record<string, string>
  messages: Record<string, string>
  routes: Record<string, string>
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
  requireIsland(identifier: string): void
  readAssetsManifest(): Promise<void>
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
  flashMessages: Record<string, string>
  requiredFlashMessages: Record<string, string>
  setFlashMessages(flashMessages: Record<string, string>): this
  requireFlashMessage(identifier: string): this

  messages: Record<string, string>
  requiredMessages: Record<string, string>
  setMessages(messages: Record<string, string>): this
  requireMessage(identifier: string): this

  routes: Record<string, string>
  requiredRoutes: Record<string, string>
  setRoutes(routes: Record<string, string>): this
  requireRoute(identifier: string): this

  requireAsset(asset: Asset): this
}

/**
 *  ManifestManager contract
 */
export interface ManifestManagerContract extends Resettable {
  hydration: Hydration
  globals: Globals
  locale: string
  route: Route | null
  flashMessages: Record<string, string>
  messages: Record<string, string>
  routes: Record<string, string>

  registerHydration(hydrationRootId: string, islandIdentifier: string, props: Record<string, unknown>): this
  addGlobals(globals: Globals): this
  setLocale(locale: string): this
  setRoute(route: Route): this
  setFlashMessages(flashMessages: Record<string, string>): this
  setMessages(messages: Record<string, string>): this
  setRoutes(routes: Record<string, string>): this

  getClientManifestAsJSON(): string
  setServerManifestOnGlobalScope(): void
}

/**
 * PluginsManager contract
 */
export interface PluginsManagerContract {
  onInitClientHooks: PluginHook<'onInitClient'>[]
  beforeHydrateHooks: PluginHook<'beforeHydrate'>[]
  onBootServerHooks: PluginHook<'onBootServer'>[]
  beforeRequestHooks: PluginHook<'beforeRequest'>[]
  afterRequestHooks: PluginHook<'afterRequest'>[]
  beforeRenderHooks: PluginHook<'beforeRender'>[]
  afterRenderHooks: PluginHook<'afterRender'>[]
  install(targetEnvironment: PluginEnvironment, ...plugins: Plugin[]): void
  execute<
    TType extends keyof PluginHooks,
    TBuilderValue extends unknown,
    TParams extends Parameters<PluginHook<TType>>
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
