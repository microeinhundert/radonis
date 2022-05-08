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
let tokens: Set<string> = new Set()
let css: string

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
    async afterOutput(files) {
      for (const file of files) {
        await generator.applyExtractors(file[1], file[0], tokens)
      }
      const result = await generator.generate(tokens, { minify: isProduction })
      css = result.css
    },
    afterRender() {
      return (html) => {
        return html.replace(/<\/head>/, `<style>${css}</style>\n</head>`)
      }
    },
  })
}
