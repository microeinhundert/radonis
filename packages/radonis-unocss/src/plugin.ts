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

  const tokensFromStaticAnalysis = new Set<string>()

  return definePlugin({
    name: 'unocss',
    environments: ['server'],
    conflictsWith: ['twind'],
    // Server hooks
    onBootServer() {
      generator = createGenerator(config ?? defaultConfig)
    },
    async onScanFile(file) {
      await generator.applyExtractors(...file, tokensFromStaticAnalysis)
    },
    afterRender() {
      const tokensFromRender = new Set(tokensFromStaticAnalysis)

      return async (html) => {
        await generator.applyExtractors(html, undefined, tokensFromRender)
        const { css } = await generator.generate(tokensFromRender, { minify: isProduction })
        return html.replace(/<\/head>/, `<style>${css}</style>\n</head>`)
      }
    },
  })
}
