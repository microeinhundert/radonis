import { dirname } from 'path'

import { getLoaderForFile } from './loaders'

/**
 * This plugin is responsible for bundling each component into its own file,
 * while wrapping the component with the code required for hydration.
 */
export const componentsPlugin = (resolveDir: string, componentsDir: string) => ({
  name: 'radonis-components',
  setup(build) {
    build.onResolve({ filter: /.*/ }, ({ path }) => {
      if (path.startsWith(componentsDir)) {
        return { path, namespace: 'radonis-component' }
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'radonis-component' }, ({ path }) => {
      console.log(dirname(path), resolveDir)

      const contents = `
        import { __internal__hydrate } from '@microeinhundert/radonis'
        console.log(__internal__hydrate);
      `

      return {
        contents,
        resolveDir: dirname(path),
        loader: getLoaderForFile(path),
      }
    })
  },
})
