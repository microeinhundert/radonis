import type { Plugin } from 'esbuild'
import { readFileSync } from 'fs'

const DEFAULT_EXPORT_REGEX = /export[ \t]+default[ \t]+(function[ \t]+)?(?<name>\w+)/gs

/**
 * This plugin is responsible for bundling each component into its own file,
 * while wrapping the component with the code required for hydration.
 */
export const componentsPlugin = (componentsDir: string): Plugin => ({
  name: 'radonis-components',
  setup(build) {
    const pluginName = 'radonis-components'

    build.onResolve({ filter: /\.tsx$/ }, ({ path }) => {
      if (path.startsWith(componentsDir)) {
        return { path, namespace: pluginName }
      }
    })

    build.onLoad({ filter: /.*/, namespace: pluginName }, ({ path }) => {
      try {
        const componentSource = readFileSync(path, 'utf8')
        const [match] = [...componentSource.matchAll(DEFAULT_EXPORT_REGEX)]

        if (!match.groups?.name) {
          return {
            errors: [
              {
                text: `Found component at ${path} without default export`,
                pluginName: pluginName,
              },
            ],
          }
        }

        return {
          contents: `
          import { registerComponentForHydration } from '@microeinhundert/radonis';
          ${componentSource}
          registerComponentForHydration('${match.groups.name}', ${match.groups.name});
          `,
          resolveDir: process.cwd(),
          loader: 'tsx',
        }
      } catch {
        return {
          errors: [
            {
              text: `Error compiling component at ${path}t`,
              pluginName: pluginName,
            },
          ],
        }
      }
    })
  },
})
