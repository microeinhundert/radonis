/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PluginException } from '../exceptions/pluginException'
import type { Plugin, PluginEnvironment, PluginHooks } from '../types'

type PluginHook<TType extends keyof PluginHooks> = PluginHooks[TType]

/**
 * @internal
 */
export class PluginsManager {
  /**
   * The singleton instance
   */
  static instance?: PluginsManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(): PluginsManager {
    return (PluginsManager.instance = PluginsManager.instance ?? new PluginsManager())
  }

  /**
   * The installed plugins
   */
  #installedPlugins: Map<string, { environments?: PluginEnvironment[]; conflictsWith?: string[] }>

  /**
   * The registered `onInitClient` hooks
   */
  onInitClientHooks: PluginHook<'onInitClient'>[]

  /**
   * The registered `beforeHydrate` hooks
   */
  beforeHydrateHooks: PluginHook<'beforeHydrate'>[]

  /**
   * The registered `onBootServer` hooks
   */
  onBootServerHooks: PluginHook<'onBootServer'>[]

  /**
   * The registered `beforeRequest` hooks
   */
  beforeRequestHooks: PluginHook<'beforeRequest'>[]

  /**
   * The registered `afterRequest` hooks
   */
  afterRequestHooks: PluginHook<'afterRequest'>[]

  /**
   * The registered `onScanFile` hooks
   */
  onScanFileHooks: PluginHook<'onScanFile'>[]

  /**
   * The registered `beforeOutput` hooks
   */
  beforeOutputHooks: PluginHook<'beforeOutput'>[]

  /**
   * The registered `afterOutput` hooks
   */
  afterOutputHooks: PluginHook<'afterOutput'>[]

  /**
   * The registered `beforeRender` hooks
   */
  beforeRenderHooks: PluginHook<'beforeRender'>[]

  /**
   * The registered `afterRender` hooks
   */
  afterRenderHooks: PluginHook<'afterRender'>[]

  /**
   * Constructor
   */
  constructor() {
    this.#installedPlugins = new Map()

    this.onInitClientHooks = []
    this.beforeHydrateHooks = []
    this.onBootServerHooks = []
    this.beforeRequestHooks = []
    this.afterRequestHooks = []
    this.onScanFileHooks = []
    this.beforeOutputHooks = []
    this.afterOutputHooks = []
    this.beforeRenderHooks = []
    this.afterRenderHooks = []
  }

  /**
   * Register the hooks of a plugin
   */
  #registerHooks(targetEnvironment: PluginEnvironment, plugin: Plugin): void {
    switch (targetEnvironment) {
      case 'client': {
        plugin.onInitClient && this.onInitClientHooks.push(plugin.onInitClient)
        plugin.beforeHydrate && this.beforeHydrateHooks.push(plugin.beforeHydrate)
        break
      }
      case 'server': {
        plugin.onBootServer && this.onBootServerHooks.push(plugin.onBootServer)
        plugin.beforeRequest && this.beforeRequestHooks.push(plugin.beforeRequest)
        plugin.afterRequest && this.afterRequestHooks.push(plugin.afterRequest)
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
  #checkForConflicts(targetEnvironment: PluginEnvironment): void {
    for (const [pluginName, { environments, conflictsWith }] of this.#installedPlugins) {
      if (!environments?.includes(targetEnvironment)) {
        continue
      }

      const conflictingPlugins = conflictsWith?.filter((conflictingPlugin) =>
        this.#installedPlugins.has(conflictingPlugin)
      )

      if (conflictingPlugins?.length) {
        throw PluginException.conflictingPlugins(pluginName, conflictingPlugins)
      }
    }
  }

  /**
   * Install a plugin or fail if it is incompatible
   */
  #installOrFail(
    targetEnvironment: PluginEnvironment,
    { name: pluginName, environments, conflictsWith }: Plugin
  ): void {
    if (this.#installedPlugins.has(pluginName)) {
      throw PluginException.pluginAlreadyInstalled(pluginName)
    }

    if (environments?.length) {
      for (const environment of ['server', 'client']) {
        if (targetEnvironment === environment && !environments.includes(environment)) {
          throw PluginException.pluginNotInstallable(pluginName, environment)
        }
      }
    }

    this.#installedPlugins.set(pluginName, { environments, conflictsWith })
  }

  /**
   * Install one or multiple plugins
   */
  install(targetEnvironment: PluginEnvironment, ...plugins: Plugin[]): void {
    for (const plugin of plugins) {
      this.#installOrFail(targetEnvironment, plugin)
      this.#checkForConflicts(targetEnvironment)
      this.#registerHooks(targetEnvironment, plugin)
    }
  }

  /**
   * Execute hooks of a specific type
   */
  async execute<
    TType extends keyof PluginHooks,
    TBuilderValue extends unknown,
    TParams extends Parameters<PluginHook<TType>>
  >(type: TType, initialBuilderValue: TBuilderValue, ...params: TParams): Promise<TBuilderValue> {
    const hooks = this[`${type}Hooks`] as PluginHook<TType>[]

    let builderValue = initialBuilderValue

    for (const hook of hooks) {
      const builderOrVoid = await hook.apply(null, params)

      if (typeof builderOrVoid === 'function') {
        builderValue = await builderOrVoid.apply(null, [builderValue])
      }
    }

    return builderValue
  }
}

/**
 * Helper to define plugins in a type-safe manner
 */
export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}
