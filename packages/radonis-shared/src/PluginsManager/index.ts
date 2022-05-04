/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { invariant } from '../invariant'
import type { Plugin, PluginEnvironment, PluginHooks } from './types'

type PluginHook<T extends keyof PluginHooks> = PluginHooks[T]

export class PluginsManager {
  /**
   * The singleton instance
   */
  private static instance: PluginsManager

  /**
   * Names of the installed plugins
   */
  private installedPlugins: Set<string> = new Set()

  /**
   * The registered `onInitClient` hooks
   */
  private onInitClientHooks: PluginHook<'onInitClient'>[] = []

  /**
   * The registered `onBootServer` hooks
   */
  private onBootServerHooks: PluginHook<'onBootServer'>[] = []

  /**
   * The registered `afterCompile` hooks
   */
  private afterCompileHooks: PluginHook<'afterCompile'>[] = []

  /**
   * The registered `beforeRender` hooks
   */
  private beforeRenderHooks: PluginHook<'beforeRender'>[] = []

  /**
   * The registered `afterRender` hooks
   */
  private afterRenderHooks: PluginHook<'afterRender'>[] = []

  /**
   * Constructor
   */
  constructor() {
    if (PluginsManager.instance) {
      return PluginsManager.instance
    }

    PluginsManager.instance = this
  }

  /**
   * Register the hooks of a plugin
   */
  private registerHooks(targetEnvironment: PluginEnvironment, plugin: Plugin): void {
    switch (targetEnvironment) {
      case 'client': {
        plugin.onInitClient && this.onInitClientHooks.push(plugin.onInitClient)
        break
      }
      case 'server': {
        plugin.onBootServer && this.onBootServerHooks.push(plugin.onBootServer)
        plugin.afterCompile && this.afterCompileHooks.push(plugin.afterCompile)
        plugin.beforeRender && this.beforeRenderHooks.push(plugin.beforeRender)
        plugin.afterRender && this.afterRenderHooks.push(plugin.afterRender)
      }
    }
  }

  /**
   * Install a plugin or fail if it is incompatible
   */
  private installOrFail(
    targetEnvironment: PluginEnvironment,
    { name: pluginName, environments, conflictsWith }: Plugin
  ): void {
    invariant(!this.installedPlugins.has(pluginName), `The plugin "${pluginName}" was already registered`)

    if (environments?.length && targetEnvironment === 'server') {
      invariant(
        environments.includes('server'),
        `The plugin "${pluginName}" is not installable in the "server" environment`
      )
    }

    if (environments?.length && targetEnvironment === 'client') {
      invariant(
        environments.includes('client'),
        `The plugin "${pluginName}" is not installable in the "client" environment`
      )
    }

    const conflictingPlugins = conflictsWith?.filter((conflictingPlugin) =>
      this.installedPlugins.has(conflictingPlugin)
    )

    if (conflictingPlugins?.length) {
      invariant(
        false,
        `The plugin "${pluginName}" conflicts with the following installed plugins: ${conflictingPlugins.join(', ')}`
      )
    }

    this.installedPlugins.add(pluginName)
  }

  /**
   * Install one or multiple plugins
   */
  public install(targetEnvironment: PluginEnvironment, ...plugins: Plugin[]): void {
    for (const plugin of plugins) {
      this.installOrFail(targetEnvironment, plugin)
      this.registerHooks(targetEnvironment, plugin)
    }
  }

  /**
   * Execute hooks of a specific type
   */
  public async execute<T extends keyof PluginHooks, B extends unknown, P extends Parameters<PluginHook<T>>>(
    type: T,
    initialBuilderValue: B,
    ...params: P
  ): Promise<B> {
    const hooks = (this as any)[`${type}Hooks`] as PluginHook<T>[]

    let builderValue = initialBuilderValue

    for (const hook of hooks) {
      const builderOrVoid = hook.apply(null, params)

      if (typeof builderOrVoid === 'function') {
        builderValue = await builderOrVoid.apply(null, [builderValue])
      }
    }

    return builderValue
  }
}
