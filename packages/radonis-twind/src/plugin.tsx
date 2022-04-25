import React from 'react'
import { inline, install } from 'twind'
import { getSheet, twind, tx as tx$ } from 'twind'

import { config } from './config'
import { TwindContextProvider } from './contexts/twindContext'
import { isProduction } from './environment'

const tw = /* @__PURE__ */ twind(config, getSheet(false))
const tx = /* @__PURE__ */ tx$.bind(tw)

export const twindPlugin: Radonis.Plugin = {
  onInitClient() {
    install(config, isProduction)
  },
  onBootServer() {
    install(config, isProduction)
  },
  beforeRender(tree) {
    return <TwindContextProvider value={{ tw, tx }}>{tree}</TwindContextProvider>
  },
  afterRender(html) {
    return inline(html)
  },
}
