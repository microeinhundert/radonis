/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin, isProduction } from '@microeinhundert/radonis-shared'
import type { UnoGenerator, UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'

import { config as defaultConfig } from './config'

let generator: UnoGenerator
let tokens = new Set<string>()

function install(config?: UserConfig): void {
  generator = createGenerator(config ?? defaultConfig)
}

export function unocssPlugin(config?: UserConfig) {
  return definePlugin({
    name: 'unocss',
    environments: ['server'],
    conflictsWith: ['twind'],
    onBootServer() {
      tokens.clear()
      install(config)
    },
    async afterOutput(files) {
      for (const file of files) {
        await generator.applyExtractors(file[1], file[0], tokens)
      }
    },
    afterRender() {
      return async (html) => {
        await generator.applyExtractors(html, undefined, tokens)
        const { css } = await generator.generate(tokens, { minify: isProduction })
        return html.replace(/<\/head>/, `<style>${css}</style>\n</head>`)
      }
    },
  })
}
