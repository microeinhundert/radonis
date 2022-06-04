/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactElement } from 'react'

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
   * This plugin hook is called before a file is output
   */
  beforeOutput: PluginHookWithBuilder<string, null>

  /**
   * This plugin hook is called after all files have been output
   */
  afterOutput: PluginHook<Map<string, string>>

  /**
   * This plugin hook is called after a file has been red
   */
  afterReadFile: PluginHook<[string, string]>

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
