import React from 'react'
import type { Twind, TwindConfig, TxFunction } from 'twind'
import { inline, install as install$ } from 'twind'
import { getSheet, twind, tx as tx$ } from 'twind'

import { config as defaultConfig } from './config'
import { TwindContextProvider } from './contexts/twindContext'
import { isProduction } from './environment'

let tw: Twind
let tx: TxFunction

const install = (config?: TwindConfig) => {
  tw = twind(config ?? defaultConfig, getSheet(false))
  tx = tx$.bind(tw)

  install$(config ?? defaultConfig, isProduction)
}

export const twindPlugin = (config?: TwindConfig): Radonis.Plugin => ({
  onInitClient() {
    install(config)
  },
  onBootServer() {
    install(config)
  },
  beforeRender() {
    return (tree) => <TwindContextProvider value={{ tw, tx }}>{tree}</TwindContextProvider>
  },
  afterRender() {
    return (html) => inline(html)
  },
})
