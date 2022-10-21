/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { ComponentType, PropsWithoutRef, ReactElement, ReactNode } from 'react'

import type { ManifestContract } from './contracts'

/**
 * Value of
 */
export type ValueOf<T> = T[keyof T]

/**
 * Unwrap props
 */
export type UnwrapProps<T> = T extends PropsWithoutRef<infer P> ? P : T

/**
 * Maybe promise
 */
export type MaybePromise<T> = Promise<T> | T

/**
 * Resettable
 */
export interface Resettable {
  reset(): void
}

/* ---------------------------------------- */

/**
 * Component identifier
 */
export type ComponentIdentifier = string

/**
 * Components
 */
export type Components = Map<ComponentIdentifier, ComponentType>

/* ---------------------------------------- */

/**
 * Hydration
 */
export type Hydration = Record<string, { componentIdentifier: string; props: Record<string, any> }>

/**
 * Hydration requirements
 */
export interface HydrationRequirements {
  flashMessages: FlashMessageIdentifier[]
  messages: MessageIdentifier[]
  routes: RouteIdentifier[]
}

/* ---------------------------------------- */

/**
 * Globals (must be an interface for declaration merging from userland)
 */
export interface Globals {}

/* ---------------------------------------- */

/**
 * Flash message identifier
 */
export type FlashMessageIdentifier = string

/**
 * Flash messages
 */
export type FlashMessages = Record<FlashMessageIdentifier, any>

/* ---------------------------------------- */

/**
 * Locale
 */
export type Locale = string

/**
 * Message identifier
 */
export type MessageIdentifier = string

/**
 * Message data
 */
export type MessageData = Record<string, any>

/**
 * Messages
 */
export type Messages = Record<MessageIdentifier, string>

/* ---------------------------------------- */

/**
 * Route identifier
 */
export type RouteIdentifier = string

/**
 * Routes
 */
export type Routes = Record<RouteIdentifier, string>

/* ---------------------------------------- */

/**
 * Route
 */
export type Route = { identifier?: string; pattern?: string }

/**
 * Route params
 */
export type RouteParams = Record<string, string | number>

/**
 * Route query params
 */
export type RouteQueryParams = Record<string, string | number | (string | number)[]>

/* ---------------------------------------- */

/**
 * Build manifest entry
 */
export interface BuildManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry' | 'chunk'
  path: string
  imports: BuildManifestEntry[]
}

/**
 * Build manifest
 */
export type BuildManifest = Record<string, BuildManifestEntry>

/**
 * Assets manifest entry
 */
export interface AssetsManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry'
  identifier: string
  path: string
}

/**
 * Assets manifest
 */
export type AssetsManifest = AssetsManifestEntry[]

/* ---------------------------------------- */

/**
 * Head meta
 */
export interface HeadMeta {
  charset?: 'utf-8'
  charSet?: 'utf-8'
  [name: string]: null | string | undefined | (Record<string, string> | string)[]
}

/**
 * Head tag
 */
export interface HeadTag {
  name: string
  content: string
  attributes?: Record<string, unknown>
}

/**
 * Error pages
 */
export interface ErrorPages {
  500?: ComponentType<{ error: unknown }>
}

/**
 * Flush callback
 */
export type FlushCallback = () => MaybePromise<ReactNode | void>

/**
 * Render options
 */
export interface RenderOptions {
  head?: {
    title?: string
    meta?: HeadMeta
    tags?: HeadTag[]
  }
  globals?: Globals
}

/* ---------------------------------------- */

/**
 * Plugin environment
 */
export type PluginEnvironment = 'client' | 'server'

/**
 * Plugin hook
 */
export type PluginHook<TInput> = (input: TInput) => Promise<void> | void

/**
 * Extract plugin hook
 */
export type ExtractPluginHook<TType extends keyof PluginHooks> = PluginHooks[TType]

/**
 * Plugin hook with builder
 */
export type PluginHookWithBuilder<TBuilderValue, TInput> = (
  input: TInput
) => (value: TBuilderValue) => MaybePromise<TBuilderValue>

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /**
   * This plugin hook is called on initialization of the client
   */
  onInitClient: PluginHook<null>

  /**
   * This plugin hook is called before a component is hydrated
   */
  beforeHydrate: PluginHookWithBuilder<ReactElement, null>

  /**
   * This plugin hook is called on boot of the server
   */
  onBootServer: PluginHook<{ appRoot: string; resourcesPath: string }>

  /**
   * This plugin hook is called before a request
   */
  beforeRequest: PluginHook<{ ctx: HttpContextContract }>

  /**
   * This plugin hook is called after a request
   */
  afterRequest: PluginHook<{ ctx: HttpContextContract }>

  /**
   * This plugin hook is called before a page is rendered
   */
  beforeRender: PluginHookWithBuilder<
    ReactElement,
    { ctx: HttpContextContract; manifest: ManifestContract; props?: Record<string, any> }
  >

  /**
   * This plugin hook is called after a chunk of a page has been rendered
   */
  afterRender: PluginHookWithBuilder<string, { ctx: HttpContextContract }>
}

/**
 * Plugin
 */
export interface Plugin extends Partial<PluginHooks> {
  /**
   * The name of the plugin
   */
  name: string

  /**
   * The environments the plugin is compatible with
   */
  environments?: PluginEnvironment[]

  /**
   * The names of the plugins the plugin conflicts with
   */
  conflictsWith?: string[]
}

export {
  AssetsManagerContract,
  HeadManagerContract,
  HydrationManagerContract,
  ManifestContract,
  ManifestManagerContract,
  PluginsManagerContract,
  RendererContract,
  ServerContract,
} from './contracts'
