/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/Application' {
  import type {
    AssetsManagerContract,
    HeadManagerContract,
    HydrationManagerContract,
    ManifestManagerContract,
    PluginsManagerContract,
    RendererContract,
  } from '@microeinhundert/radonis-types'

  interface ContainerBindings {
    'Microeinhundert/Radonis/AssetsManager': AssetsManagerContract
    'Microeinhundert/Radonis/HeadManager': HeadManagerContract
    'Microeinhundert/Radonis/HydrationManager': HydrationManagerContract
    'Microeinhundert/Radonis/ManifestManager': ManifestManagerContract
    'Microeinhundert/Radonis/PluginsManager': PluginsManagerContract
    'Microeinhundert/Radonis/Renderer': RendererContract
  }
}
