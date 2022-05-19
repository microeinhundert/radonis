/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { definePlugin } from '@microeinhundert/radonis'
import { isProduction } from '@microeinhundert/radonis-shared'
import type { UnoGenerator, UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'

import { config as defaultConfig } from './config'

export function unocssPlugin(config?: UserConfig) {
  let generator: UnoGenerator
  const outputTokens = new Set<string>()

  return definePlugin({
    name: 'unocss',
    environments: ['server'],
    conflictsWith: ['twind'],
    // Server hooks
    onBootServer() {
      generator = createGenerator(config ?? defaultConfig)
    },
    async afterOutput(files) {
      outputTokens.clear()

      for (const file of files) {
        await generator.applyExtractors(file[1], file[0], outputTokens)
      }
    },
    afterRender() {
      const renderTokens = new Set(outputTokens)

      return async (html) => {
        await generator.applyExtractors(html, undefined, renderTokens)
        const { css } = await generator.generate(renderTokens, { minify: isProduction })
        return html.replace(/<\/head>/, `<style>${css}</style>\n</head>`)
      }
    },
  })
}
