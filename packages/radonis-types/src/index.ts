/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { outputFile } from 'fs-extra'
import { join } from 'path'
import type { ComponentType, ReactElement } from 'react'

/**
 * Component identifier (overridden by generated type)
 */
export type ComponentIdentifier = string

/**
 * Components
 */
export type Components = Map<ComponentIdentifier, ComponentType>

/**
 * Generate a union type of all components
 */
export function generateComponentIdentifierUnionType(components: ComponentIdentifier[]): string {
  if (!components.length) return 'type ComponentIdentifier = never'

  return `type ComponentIdentifier = ${components.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Props hash
 */
export type PropsHash = string

/**
 * Props
 */
export type Props = Record<PropsHash, Record<string, any>>

/* ---------------------------------------- */

/**
 * Globals (must be an interface for declaration merging, overridden by consumer)
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
 * Message identifier (overridden by generated type)
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

/**
 * Generate a union type of all available messages
 */
export function generateMessageIdentifierUnionType(messages: MessageIdentifier[]): string {
  if (!messages.length) return 'type MessageIdentifier = never'

  return `type MessageIdentifier = ${messages.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route identifier (overridden by generated type)
 */
export type RouteIdentifier = string

/**
 * Routes
 */
export type Routes = Record<RouteIdentifier, string>

/**
 * Generate a union type of all available routes
 */
export function generateRouteIdentifierUnionType(routes: RouteIdentifier[]): string {
  if (!routes.length) return 'type RouteIdentifier = never'

  return `type RouteIdentifier = ${routes.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route
 */
export type Route = { name?: string; pattern?: string }

/**
 * Route params
 */
export type RouteParams = Record<string, string | number>

/* ---------------------------------------- */

/**
 * Manifest
 */
export type Manifest = {
  props: Props
  flashMessages: FlashMessages
  locale: Locale
  messages: Messages
  routes: Routes
  route: Route | null
} & { globals: Globals }

/* ---------------------------------------- */

/**
 * Hydration requirements
 */
export interface HydrationRequirements {
  flashMessages: Set<FlashMessageIdentifier>
  messages: Set<MessageIdentifier>
  routes: Set<RouteIdentifier>
}

/* ---------------------------------------- */

/**
 * Build manifest entry
 */
export interface BuildManifestEntry extends HydrationRequirements {
  type: 'component' | 'entry' | 'chunk'
  path: string
  publicPath: string
  imports: BuildManifestEntry[]
}

/**
 * Build manifest
 */
export type BuildManifest = Record<string, BuildManifestEntry>

/* ---------------------------------------- */

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
 * Plugin environment
 */
export type PluginEnvironment = 'client' | 'server'

/**
 * Plugin hook
 */
export type PluginHook<I> = (input: I) => Promise<void> | void

/**
 * Plugin hook with builder
 */
export type PluginHookWithBuilder<B, I> = (input: I) => (value: B) => Promise<B> | B

/**
 * Plugin hooks
 */
export interface PluginHooks {
  /**
   * This plugin hook is called after the client has been initialized
   */
  onInitClient: PluginHook<null>

  /**
   * This plugin hook is called before a component is hydrated
   */
  beforeHydrate: PluginHookWithBuilder<ReactElement, null>

  /**
   * This plugin hook is called after the server has been booted
   */
  onBootServer: PluginHook<null>

  /**
   * This plugin hook is called before a file is output by the compiler
   */
  beforeOutput: PluginHookWithBuilder<string, null>

  /**
   * This plugin hook is called after all files have been output by the compiler
   */
  afterOutput: PluginHook<Map<string, string>>

  /**
   * This plugin hook is called before the compiler starts
   */
  beforeCompile: PluginHook<null>

  /**
   * This plugin hook is called after the compiler has finished
   */
  afterCompile: PluginHook<null>

  /**
   * This plugin hook is called before the page is rendered
   */
  beforeRender: PluginHookWithBuilder<ReactElement, null>

  /**
   * This plugin hook is called after the page has been rendered
   */
  afterRender: PluginHookWithBuilder<string, null>
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
   * The names of the plugins this plugin conflicts with
   */
  conflictsWith?: string[]
}

/* ---------------------------------------- */

/**
 * Headers
 */
export type Headers = Record<string, string>

/**
 * Method
 */
export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

/**
 * Encoding type
 */
export type EncType = 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded'

/**
 * Transition state
 */
export type TransitionState = 'idle' | 'submitting' | 'error' | 'catch-error'

/**
 * Transition
 */
export interface Transition {
  state: TransitionState
  formData: FormData
}

/**
 * Response param
 */
export type ResponseParam<TData> = Response & { data: TData }

/**
 * Form hooks
 */
export type FormHooks<TData, TError> = {
  /**
   * This hook is called before a fetch request is made
   */
  beforeRequest?: (init: Omit<RequestInit, 'signal'>) => void

  /**
   * This hook is called after any fetch request
   */
  afterRequest?: () => void

  /**
   * This hook is called on success
   */
  onSuccess?: (response: ResponseParam<TData>) => void

  /**
   * This hook is called on error
   */
  onError?: (response: ResponseParam<TError>) => void

  /**
   * This hook is called on catched error
   */
  onCatchError?: (error: any) => void

  /**
   * This hook is called after the fetch request was aborted
   */
  afterAbort?: () => void
}

/**
 * Request init options
 */
export interface RequestInitOptions {
  action: string
  method?: Method
  encType?: EncType
  requestHeaders?: Headers
  requestBody?: Record<string, any>
  transform?: (data: Record<string, any>) => any
  formData?: FormData
}

/**
 * Fetch options
 */
export interface FetchOptions<TData, TError> {
  action: string
  method: Method
  encType?: EncType
  headers?: Headers
  body?: Record<string, any>
  transform?: (data: Record<string, any>) => any
  hooks?: FormHooks<TData, TError>
  formData?: FormData
}

/**
 * Form options
 */
export interface FormOptions<TData, TError> extends FetchOptions<TData, TError> {
  includeSubmitValue?: boolean
  formData: never
}

/**
 * Form children props
 */
export type FormChildrenProps<TData, TError> = {
  data: TData | null
  error: TError | null
  status: number
  transition: Transition
  abort: () => void
}

/* ---------------------------------------- */

/**
 * Utils
 */
export type ValueOf<T> = T[keyof T]

/* ---------------------------------------- */

export function generateAndWriteTypesToDisk(
  {
    components,
    messages,
    routes,
  }: {
    components: ComponentIdentifier[]
    messages: MessageIdentifier[]
    routes: RouteIdentifier[]
  },
  outputDir: string
): void {
  const typeDeclarations = [
    generateComponentIdentifierUnionType(components),
    generateMessageIdentifierUnionType(messages),
    generateRouteIdentifierUnionType(routes),
  ].join('\n')

  outputFile(
    join(outputDir, 'radonis.d.ts'),
    `// This file is auto-generated, DO NOT EDIT\ndeclare module '@microeinhundert/radonis-types' {\n${typeDeclarations}\n}\nexport {}`
  )
}
