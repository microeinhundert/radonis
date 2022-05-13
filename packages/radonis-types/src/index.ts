/*
 * @microeinhundert/radonis-types
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactElement } from 'react'

/**
 * Props hash
 */
export type PropsHash = string

/**
 * Props
 */
export type Props = Record<string, any>

/**
 * Globals (must be an interface for declaration merging)
 */
export interface Globals {}

/**
 * Flash message
 */
export type FlashMessage = string | boolean | number

/**
 * Route
 */
export type Route = { name?: string; pattern?: string }

/**
 * Manifest
 */
export type Manifest = {
  props: Record<PropsHash, Props>
  globals: Globals
  flashMessages: Record<string, FlashMessage>
  locale: string
  messages: Record<string, string>
  routes: Record<string, any>
  route: Route | null
}

/**
 * Build manifest entry
 */
export type BuildManifestEntry = {
  type: 'component' | 'entry' | 'chunk'
  path: string
  publicPath: string
  flashMessages: Set<string>
  messages: Set<string>
  routes: Set<string>
  imports: BuildManifestEntry[]
}

/**
 * Build manifest
 */
export type BuildManifest = Record<string, BuildManifestEntry>

/**
 * Assets manifest entry
 */
export type AssetsManifestEntry = {
  type: 'component' | 'entry'
  identifier: string
  path: string
  flashMessages: Set<string>
  messages: Set<string>
  routes: Set<string>
}

/**
 * Assets manifest
 */
export type AssetsManifest = AssetsManifestEntry[]

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
