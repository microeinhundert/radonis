/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Microeinhundert/Radonis' {
  import type { ReactElement } from 'react'
  import type { HeadMeta, ComponentIdentifier } from '@microeinhundert/radonis-types'
  import type { BuildOptions } from '@microeinhundert/radonis-build'
  import type { Plugin } from '@microeinhundert/radonis-shared'

  function HydrationRoot(props: {
    children: ReactElement<Record<string, any>>
    component: ComponentIdentifier
    className?: string
    disabled?: boolean
  }): JSX.Element

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
