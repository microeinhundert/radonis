/*
 * @microeinhundert/radonis-twind
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin, isProduction } from '@microeinhundert/radonis-shared'
import React from 'react'
import type { Twind, TwindConfig, TxFunction } from 'twind'
import { inline, install as install$ } from 'twind'
import { getSheet, twind, tx as tx$ } from 'twind'

import { config as defaultConfig } from './config'
import { TwindContextProvider } from './contexts/twindContext'
import { minifyTxLiterals } from './utils'

let tw: Twind
let tx: TxFunction

function install(config?: TwindConfig): void {
  tw = twind(config ?? defaultConfig, getSheet(false))
  tx = tx$.bind(tw)

  install$(config ?? defaultConfig, isProduction)
}

export function twindPlugin(config?: TwindConfig) {
  return definePlugin({
    name: 'twind',
    environments: ['client', 'server'],
    conflictsWith: ['unocss'],
    onInitClient() {
      install(config)
    },
    onBootServer() {
      install(config)
    },
    beforeOutput() {
      return (source) => minifyTxLiterals(source)
    },
    beforeRender() {
      return (tree) => <TwindContextProvider value={{ tw, tx }}>{tree}</TwindContextProvider>
    },
    afterRender() {
      return (html) => inline(html)
    },
  })
}
