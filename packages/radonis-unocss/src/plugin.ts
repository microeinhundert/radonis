/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path/posix'

import { definePlugin } from '@microeinhundert/radonis'
import { isProduction } from '@microeinhundert/radonis-shared'
import { fsReadAll } from '@poppinss/utils/build/helpers'
import type { UserConfig } from '@unocss/core'
import { createGenerator } from '@unocss/core'

import { config as defaultConfig } from './config'

/**
 * Plugin for integrating {@link https://github.com/unocss/unocss UnoCSS} with Radonis
 * @see https://radonis.vercel.app/docs/plugins/unocss
 */
export function unocssPlugin(config?: UserConfig) {
  let cssInjected = false
  let css: string

  const tokens = new Set<string>()

  return definePlugin({
    name: 'unocss',
    environments: ['server'],
    async onBootServer({ resourcesPath }) {
      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx']
      const generator = createGenerator(config ?? defaultConfig)
      const filePaths = fsReadAll(resourcesPath, (filePath) =>
        extensions.some((extension) => filePath.endsWith(extension))
      )

      /**
       * Look for classes in files
       */
      for (const filePath of filePaths) {
        const fileContents = readFileSync(join(resourcesPath, filePath), 'utf8')
        await generator.applyExtractors(fileContents, filePath, tokens)
      }

      const generatorResult = await generator.generate(tokens, {
        minify: isProduction,
      })

      css = generatorResult.css
    },
    beforeRequest() {
      cssInjected = false
    },
    afterRender() {
      return (html: string) => {
        const headIndex = html.indexOf('</head>')

        if (!cssInjected && css && headIndex !== -1) {
          cssInjected = true

          return html.replace('</head>', `\n<style>${css}</style>\n</head>`)
        }

        return html
      }
    },
  })
}
