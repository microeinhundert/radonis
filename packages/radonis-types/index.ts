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

export type ValueOf<T> = T[keyof T]

export type UnwrapProps<T> = T extends PropsWithoutRef<infer P> ? P : T

export type MaybePromise<T> = Promise<T> | T

export interface Resettable {
  reset(): void
}

export type Hydration = Record<string, { islandIdentifier: string; props: Record<string, unknown> }>

export interface Globals {}

export type MessageData = Record<string, unknown>

export type Route = {
  identifier?: string
  pattern: string
  params: Record<string, unknown>
  searchParams: Record<string, unknown>
}

export type RouteParams = Record<string, string | number>

export type RouteQueryParams = Record<string, string | number | (string | number)[]>

export enum AssetType {
  ClientScript = 'radonis-client-script',
  IslandScript = 'radonis-island-script',
  ChunkScript = 'radonis-chunk-script',
}

export interface Asset {
  type: AssetType
  path: string
  name: string
  islands: string[]
  tokens: string[]
}

export type AssetsManifest = Asset[]

export type AttributeValue = string | number | boolean | null | undefined

export interface HeadMeta {
  charset?: 'utf-8'
  charSet?: 'utf-8'
  [name: string]: AttributeValue
}

export interface HeadTag {
  name: string
  content: string
  attributes?: Record<string, AttributeValue>
}

export interface ErrorPages {
  500?: ComponentType<{ error: unknown }>
}

export type FlushCallback = () => MaybePromise<ReactNode | void>

export interface RenderOptions {
  head?: {
    title?: string
    meta?: HeadMeta
    tags?: HeadTag[]
  }
  globals?: Globals
}

export type PluginEnvironment = 'client' | 'server'

export type PluginHookCallback<TInput> = (input: TInput) => Promise<void> | void

export type PluginHookBuilderCallback<TBuilderValue, TInput> = (
  input: TInput
) => (value: TBuilderValue) => MaybePromise<TBuilderValue>

export type PluginHook<TType extends keyof PluginHooks> = PluginHooks[TType]

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
