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
    for (const { onInitClient, onBootServer, beforeRender, afterRender } of plugins) {
      if (onInitClient) {
        this.onInitClientHooks.push(onInitClient)
      }

      if (onBootServer) {
        this.onBootServerHooks.push(onBootServer)
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
  public execute<T extends keyof ManagedPlugin, P extends Parameters<ManagedPlugin[T]>>(type: T, ...params: P): P[0] {
    const hooks = (this as any)[`${type}Hooks`] as ManagedPlugin[T][]
    const [firstParam, ...restParams] = params

    return hooks.reduce((prevReturnValue, hook) => {
      const returnValue = hook.apply(null, [prevReturnValue, ...restParams])

      if (typeof returnValue !== typeof firstParam) {
        throw new Error('The return value of a plugin hook must be of the same type as the first parameter')
      }

      return returnValue
    }, firstParam)
  }
}
