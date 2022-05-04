/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactElement } from 'react'

export type PluginEnvironment = 'client' | 'server'

export type PluginHook = (() => Promise<void>) | (() => void)
export type PluginHookWithBuilder<T> = () => ((value: T) => Promise<T>) | ((value: T) => T)

export type PluginHooks = {
  /**
   * This plugin hook is called after the client has been initialized
   */
  onInitClient: PluginHook

  /**
   * This plugin hook is called after the server has been booted
   */
  onBootServer: PluginHook

  /**
   * This plugin hook is called after the client has been compiled
   */
  afterCompile: PluginHookWithBuilder<string>

  /**
   * This plugin hook is called before the page is rendered
   */
  beforeRender: PluginHookWithBuilder<ReactElement>

  /**
   * This plugin hook is called after the page is rendered
   */
  afterRender: PluginHookWithBuilder<string>
}

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
