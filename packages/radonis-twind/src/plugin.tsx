/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin } from '@microeinhundert/radonis'
import { isProduction } from '@microeinhundert/radonis-shared'
import type { Twind, TwindConfig, TxFunction } from 'twind'
import { getSheet, inline, install as install$, twind, tx as tx$ } from 'twind'

import { config as defaultConfig } from './config'
import { TwindContextProvider } from './contexts/twindContext'

/**
 * Plugin for integrating {@link https://twind.dev/ Twind} with Radonis
 * @see https://radonis.vercel.app/docs/plugins/twind
 */
export function twindPlugin(config?: TwindConfig) {
  let tw: Twind
  let tx: TxFunction

  function install(): void {
    tw = twind(config ?? defaultConfig, getSheet(false))
    tx = tx$.bind(tw)

    install$(config ?? defaultConfig, isProduction)
  }

  return definePlugin({
    name: 'twind',
    environments: ['client', 'server'],
    conflictsWith: ['unocss'],
    onInitClient() {
      install()
    },
    beforeHydrate() {
      return (tree) => <TwindContextProvider value={{ tw, tx }}>{tree}</TwindContextProvider>
    },
    onBootServer() {
      install()
    },
    beforeRender() {
      return (tree) => <TwindContextProvider value={{ tw, tx }}>{tree}</TwindContextProvider>
    },
    afterRender() {
      return (html) => inline(html)
    },
  })
}
