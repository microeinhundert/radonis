/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Microeinhundert/Radonis' {
  import type { HeadMeta, Plugin } from '@microeinhundert/radonis-types'
  import type { BuildOptions } from '@microeinhundert/radonis-build'

  interface RadonisConfig {
    plugins: Plugin[]
    head: {
      title: {
        default: string
        prefix: string
        suffix: string
        separator: string
      }
      defaultMeta: HeadMeta
    }
    server: {
      streaming: boolean
    }
    client: {
      entryFile: string
      alwaysIncludeEntryFile: boolean
      componentsDir: string
      limitManifest: boolean
      buildOptions: BuildOptions
    }
  }
}
