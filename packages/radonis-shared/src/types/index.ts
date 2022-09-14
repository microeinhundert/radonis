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
export type PluginHook<TInput> = (input: TInput) => Promise<void> | void

/**
 * Plugin hook with builder
 */
export type PluginHookWithBuilder<TBuilderValue, TInput> = (
  input: TInput
) => (value: TBuilderValue) => Promise<TBuilderValue> | TBuilderValue

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
  onBootServer: PluginHook<null>

  /**
   * This plugin hook is called before a request
   */
  beforeRequest: PluginHook<null>

  /**
   * This plugin hook is called after a request
   */
  afterRequest: PluginHook<null>

  /**
   * This plugin hook is called on scan of a previously output file
   */
  onScanFile: PluginHook<[string, string]>

  /**
   * This plugin hook is called before a file is output
   */
  beforeOutput: PluginHookWithBuilder<string, null>

  /**
   * This plugin hook is called after all files have been output
   */
  afterOutput: PluginHook<Map<string, string>>

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
   * The names of the plugins the plugin conflicts with
   */
  conflictsWith?: string[]
}
