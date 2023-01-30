/*
 * @microeinhundert/radonis-unocss
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFile } from 'node:fs/promises'

import { definePlugin } from '@microeinhundert/radonis'
import { isProduction } from '@microeinhundert/radonis-shared'
import { fsReadAll } from '@microeinhundert/radonis-shared/node'
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
      const paths = await fsReadAll(resourcesPath, {
        filter: (filePath) => extensions.some((extension) => filePath.endsWith(extension)),
      })

      /**
       * Search for classes in files
       */
      for (const path of paths) {
        const contents = await readFile(path, { encoding: 'utf-8' })
        await generator.applyExtractors(contents, path, tokens)
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
        const hasHead = html.includes('</head>')

        if (!cssInjected && css && hasHead) {
          cssInjected = true

          return html.replace('</head>', `\n<style>${css}</style>\n</head>`)
        }

        return html
      }
    },
  })
}
