/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  ExtractPluginHook,
  Plugin,
  PluginEnvironment,
  PluginHooks,
  PluginsManagerContract,
} from '@microeinhundert/radonis-types'

import { PluginException } from '../../exceptions/pluginException'

/**
 * Service for managing plugins
 * @internal
 */
export class PluginsManager implements PluginsManagerContract {
  /**
   * The singleton instance
   */
  static instance?: PluginsManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof PluginsManager>): PluginsManager {
    return (PluginsManager.instance = PluginsManager.instance ?? new PluginsManager(...args))
  }

  /**
   * The installed plugins
   */
  #installedPlugins: Map<string, { environments?: PluginEnvironment[]; conflictsWith?: string[] }>

  /**
   * The registered `onInitClient` hooks
   */
  onInitClientHooks: ExtractPluginHook<'onInitClient'>[]

  /**
   * The registered `beforeHydrate` hooks
   */
  beforeHydrateHooks: ExtractPluginHook<'beforeHydrate'>[]

  /**
   * The registered `onBootServer` hooks
   */
  onBootServerHooks: ExtractPluginHook<'onBootServer'>[]

  /**
   * The registered `beforeRequest` hooks
   */
  beforeRequestHooks: ExtractPluginHook<'beforeRequest'>[]

  /**
   * The registered `afterRequest` hooks
   */
  afterRequestHooks: ExtractPluginHook<'afterRequest'>[]

  /**
   * The registered `beforeRender` hooks
   */
  beforeRenderHooks: ExtractPluginHook<'beforeRender'>[]

  /**
   * The registered `afterRender` hooks
   */
  afterRenderHooks: ExtractPluginHook<'afterRender'>[]

  /**
   * Constructor
   */
  constructor() {
    this.#setDefaults()
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
        plugin.beforeRender && this.beforeRenderHooks.push(plugin.beforeRender)
        plugin.afterRender && this.afterRenderHooks.push(plugin.afterRender)
      }
    }
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
    TParams extends Parameters<ExtractPluginHook<TType>>
  >(type: TType, initialBuilderValue: TBuilderValue, ...args: TParams): Promise<TBuilderValue> {
    const hooks = this[`${type}Hooks`] as ExtractPluginHook<TType>[]

    let builderValue = initialBuilderValue

    for (const hook of hooks) {
      const builderOrVoid = await hook.apply(null, args)

      if (typeof builderOrVoid === 'function') {
        builderValue = await builderOrVoid.apply(null, [builderValue])
      }
    }

    return builderValue
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
   * Set the defaults
   */
  #setDefaults(): void {
    this.#installedPlugins = new Map()

    this.onInitClientHooks = []
    this.beforeHydrateHooks = []
    this.onBootServerHooks = []
    this.beforeRequestHooks = []
    this.afterRequestHooks = []
    this.beforeRenderHooks = []
    this.afterRenderHooks = []
  }
}
