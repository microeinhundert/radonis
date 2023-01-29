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

import type { ManifestContract } from './src/contracts'

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

/**
 * Hydration
 */
export type Hydration = Record<string, { islandIdentifier: string; props: Record<string, unknown> }>

/**
 * Globals (must be an interface for declaration merging from userland)
 */
export interface Globals {}

/**
 * Message data
 */
export type MessageData = Record<string, unknown>

/**
 * Route
 */
export type Route = {
  identifier?: string
  pattern: string
  params: Record<string, unknown>
  searchParams: Record<string, unknown>
}

/**
 * Route params
 */
export type RouteParams = Record<string, string | number>

/**
 * Route query params
 */
export type RouteQueryParams = Record<string, string | number | (string | number)[]>

/**
 * Asset type
 */
export enum AssetType {
  ClientScript = 'radonis-client-script',
  IslandScript = 'radonis-island-script',
  ChunkScript = 'radonis-chunk-script',
}

/**
 * Asset
 */
export interface Asset {
  type: AssetType
  path: string
  name: string
  islands: string[]
  tokens: string[]
}

/**
 * Assets manifest
 */
export type AssetsManifest = Asset[]

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

/**
 * Plugin environment
 */
export type PluginEnvironment = 'client' | 'server'

/**
 * Plugin hook callback
 */
export type PluginHookCallback<TInput> = (input: TInput) => Promise<void> | void

/**
 * Plugin hook builder callback
 */
export type PluginHookBuilderCallback<TBuilderValue, TInput> = (
  input: TInput
) => (value: TBuilderValue) => MaybePromise<TBuilderValue>

/**
 * Plugin hook
 */
export type PluginHook<TType extends keyof PluginHooks> = PluginHooks[TType]

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /**
   * This plugin hook is called on initialization of the client
   */
  onInitClient: PluginHookCallback<null>

  /**
   * This plugin hook is called before an island is hydrated
   */
  beforeHydrate: PluginHookBuilderCallback<ReactElement, null>

  /**
   * This plugin hook is called on boot of the server
   */
  onBootServer: PluginHookCallback<{ appRoot: string; resourcesPath: string }>

  /**
   * This plugin hook is called before a request
   */
  beforeRequest: PluginHookCallback<{ ctx: HttpContextContract }>

  /**
   * This plugin hook is called after a request
   */
  afterRequest: PluginHookCallback<{ ctx: HttpContextContract }>

  /**
   * This plugin hook is called before a page is rendered
   */
  beforeRender: PluginHookBuilderCallback<
    ReactElement,
    { ctx: HttpContextContract; manifest: ManifestContract; props?: Record<string, unknown> }
  >

  /**
   * This plugin hook is called after a chunk of a page has been rendered
   */
  afterRender: PluginHookBuilderCallback<string, { ctx: HttpContextContract }>
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
} from './src/contracts'
