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
 * Hydratable component name
 */
export type HydratableComponentName = string

/**
 * Hydratable components
 */
export type HydratableComponents = Record<HydratableComponentName, ComponentType>

/**
 * Generate a union type of all hydratable components
 */
export function generateHydratableComponentNameUnionType(components: HydratableComponentName[]): string {
  if (!components.length) return 'type HydratableComponentName = never'

  return `type HydratableComponentName = ${components.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Props hash
 */
export type PropsGroupHash = string

/**
 * Props groups
 */
export type PropsGroups = Record<PropsGroupHash, Record<string, any>>

/* ---------------------------------------- */

/**
 * Globals (must be an interface for declaration merging)
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
export type FlashMessages = Record<FlashMessageIdentifier, string | boolean | number>

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

/**
 * Generate a union type of all available messages
 */
export function generateMessageIdentifierUnionType(messages: MessageIdentifier[]): string {
  if (!messages.length) return 'type MessageIdentifier = never'

  return `type MessageIdentifier = ${messages.map((value) => `'${value}'`).join(' | ')}`
}

/* ---------------------------------------- */

/**
 * Route identifier
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
  props: PropsGroups
  globals: Globals
  flashMessages: FlashMessages
  locale: Locale
  messages: Messages
  routes: Routes
  route: Route | null
}

/* ---------------------------------------- */

/**
 * Hydration requirements
 */
export type HydrationRequirements = {
  flashMessages: Set<string>
  messages: Set<string>
  routes: Set<string>
}

/* ---------------------------------------- */

/**
 * Build manifest entry
 */
export type BuildManifestEntry = HydrationRequirements & {
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
export type AssetsManifestEntry = HydrationRequirements & {
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
export type PluginHooks = {
  /**
   * This plugin hook is called after the client has been initialized
   */
  onInitClient: PluginHook<null>

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
export type Plugin = Partial<PluginHooks> & {
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
    components: HydratableComponentName[]
    messages: MessageIdentifier[]
    routes: RouteIdentifier[]
  },
  outputDir: string
): void {
  const typeDeclarations = [
    generateHydratableComponentNameUnionType(components),
    generateMessageIdentifierUnionType(messages),
    generateRouteIdentifierUnionType(routes),
  ].join('\n')

  outputFile(
    join(outputDir, 'radonis.d.ts'),
    `// This file is auto-generated, DO NOT EDIT\ndeclare module '@microeinhundert/radonis-types' {\n${typeDeclarations}\n}`
  )
}
