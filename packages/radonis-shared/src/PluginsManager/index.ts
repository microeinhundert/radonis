/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Plugin, PluginEnvironment, PluginHooks } from '../types'
import { invariant } from '../utils'

type PluginHook<T extends keyof PluginHooks> = PluginHooks[T]

/**
 * @internal
 */
export class PluginsManager {
  /**
   * The singleton instance
   */
  private static instance?: PluginsManager

  /**
   * The installed plugins
   */
  private installedPlugins: Map<string, { environments?: PluginEnvironment[]; conflictsWith?: string[] }> = new Map()

  /**
   * The registered `onInitClient` hooks
   */
  private onInitClientHooks: PluginHook<'onInitClient'>[] = []

  /**
   * The registered `beforeHydrate` hooks
   */
  private beforeHydrateHooks: PluginHook<'beforeHydrate'>[] = []

  /**
   * The registered `onBootServer` hooks
   */
  private onBootServerHooks: PluginHook<'onBootServer'>[] = []

  /**
   * The registered `onScanFile` hooks
   */
  private onScanFileHooks: PluginHook<'onScanFile'>[] = []

  /**
   * The registered `beforeOutput` hooks
   */
  private beforeOutputHooks: PluginHook<'beforeOutput'>[] = []

  /**
   * The registered `afterOutput` hooks
   */
  private afterOutputHooks: PluginHook<'afterOutput'>[] = []

  /**
   * The registered `beforeRender` hooks
   */
  private beforeRenderHooks: PluginHook<'beforeRender'>[] = []

  /**
   * The registered `afterRender` hooks
   */
  private afterRenderHooks: PluginHook<'afterRender'>[] = []

  /**
   * Register the hooks of a plugin
   */
  private registerHooks(targetEnvironment: PluginEnvironment, plugin: Plugin): void {
    switch (targetEnvironment) {
      case 'client': {
        plugin.onInitClient && this.onInitClientHooks.push(plugin.onInitClient)
        plugin.beforeHydrate && this.beforeHydrateHooks.push(plugin.beforeHydrate)
        break
      }
      case 'server': {
        plugin.onBootServer && this.onBootServerHooks.push(plugin.onBootServer)
        plugin.onScanFile && this.onScanFileHooks.push(plugin.onScanFile)
        plugin.beforeOutput && this.beforeOutputHooks.push(plugin.beforeOutput)
        plugin.afterOutput && this.afterOutputHooks.push(plugin.afterOutput)
        plugin.beforeRender && this.beforeRenderHooks.push(plugin.beforeRender)
        plugin.afterRender && this.afterRenderHooks.push(plugin.afterRender)
      }
    }
  }

  /**
   * Check for conflicts between installed plugins
   */
  private checkForConflicts(targetEnvironment: PluginEnvironment): void {
    for (const [pluginName, { environments, conflictsWith }] of this.installedPlugins) {
      if (!environments?.includes(targetEnvironment)) {
        continue
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
    }
  }

  /**
   * Install a plugin or fail if it is incompatible
   */
  private installOrFail(
    targetEnvironment: PluginEnvironment,
    { name: pluginName, environments, conflictsWith }: Plugin
  ): void {
    invariant(!this.installedPlugins.has(pluginName), `The plugin "${pluginName}" is already installed`)

    if (environments?.length) {
      for (const environment of ['server', 'client']) {
        if (targetEnvironment === environment) {
          invariant(
            environments.includes(environment),
            `The plugin "${pluginName}" is not installable in the "${environment}" environment`
          )
        }
      }
    }

    this.installedPlugins.set(pluginName, { environments, conflictsWith })
  }

  /**
   * Install one or multiple plugins
   */
  public install(targetEnvironment: PluginEnvironment, ...plugins: Plugin[]): void {
    for (const plugin of plugins) {
      this.installOrFail(targetEnvironment, plugin)
      this.checkForConflicts(targetEnvironment)
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
    const hooks = this[`${type}Hooks`] as PluginHook<T>[]

    let builderValue = initialBuilderValue

    for (const hook of hooks) {
      const builderOrVoid = await hook.apply(null, params)

      if (typeof builderOrVoid === 'function') {
        builderValue = await builderOrVoid.apply(null, [builderValue])
      }
    }

    return builderValue
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): PluginsManager {
    return (PluginsManager.instance = PluginsManager.instance ?? new PluginsManager())
  }
}

/**
 * Helper to define plugins in a type-safe manner
 */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}
