/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type ManagedPlugin = Required<Radonis.Plugin>

export class PluginsManager {
  /**
   * The singleton instance
   */
  private static instance: PluginsManager

  /**
   * The `onInitClient` hooks
   */
  private onInitClientHooks: ManagedPlugin['onInitClient'][] = []

  /**
   * The `onBootServer` hooks
   */
  private onBootServerHooks: ManagedPlugin['onBootServer'][] = []

  /**
   * The `beforeCompileComponent` hooks
   */
  private beforeCompileComponentHooks: ManagedPlugin['beforeCompileComponent'][] = []

  /**
   * The `beforeRender` hooks
   */
  private beforeRenderHooks: ManagedPlugin['beforeRender'][] = []

  /**
   * The `afterRender` hooks
   */
  private afterRenderHooks: ManagedPlugin['afterRender'][] = []

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
   * Register one or multiple plugins
   */
  public registerPlugins(...plugins: Radonis.Plugin[]): this {
    for (const { onInitClient, onBootServer, beforeCompileComponent, beforeRender, afterRender } of plugins) {
      if (onInitClient) {
        this.onInitClientHooks.push(onInitClient)
      }

      if (onBootServer) {
        this.onBootServerHooks.push(onBootServer)
      }

      if (beforeCompileComponent) {
        this.beforeCompileComponentHooks.push(beforeCompileComponent)
      }

      if (beforeRender) {
        this.beforeRenderHooks.push(beforeRender)
      }

      if (afterRender) {
        this.afterRenderHooks.push(afterRender)
      }
    }

    return this
  }

  /**
   * Execute hooks of a specific type
   */
  public executeHooks<T extends keyof ManagedPlugin, B extends unknown, P extends Parameters<ManagedPlugin[T]>>(
    type: T,
    initialBuilderValue: B,
    ...params: P
  ): B {
    const hooks = (this as any)[`${type}Hooks`] as ManagedPlugin[T][]

    let builderValue = initialBuilderValue

    for (const hook of hooks) {
      const builderOrVoid = hook.apply(null, params)

      if (typeof builderOrVoid === 'function') {
        builderValue = builderOrVoid.apply(null, [builderValue])
      }
    }

    return builderValue
  }
}
