import { definePlugin } from '@microeinhundert/radonis-shared'
import type { UnoGenerator, UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'

import { config as defaultConfig } from './config'

let generator: UnoGenerator

function install(config?: UserConfig): void {
  generator = createGenerator(config ?? defaultConfig)
}

export function unocssPlugin(config?: UserConfig) {
  return definePlugin({
    name: 'unocss',
    environments: ['server'],
    conflictsWith: ['twind'],
    onBootServer() {
      install(config)
    },
    afterRender() {
      return async (html) => {
        const { css } = await generator.generate(html)
        console.log(css)
        return html
      }
    },
  })
}
