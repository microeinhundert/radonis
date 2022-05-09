/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type HydrationRequirements = {
  flashMessages: Set<string>
  messages: Set<string>
  routes: Set<string>
}

/**
 * Reduce the hydration requirements for a build manifest entry and its imports
 */
function reduceHydrationRequirements(
  buildManifestEntries: Radonis.BuildManifestEntry[],
  initialRequirements?: HydrationRequirements
): HydrationRequirements {
  return buildManifestEntries.reduce<HydrationRequirements>(
    (hydrationRequirements, buildManifestEntry) => {
      const childRequirements = reduceHydrationRequirements(buildManifestEntry.imports)

      const mergedFlashMessages = new Set([
        ...childRequirements.flashMessages,
        ...hydrationRequirements.flashMessages,
        ...buildManifestEntry.flashMessages,
      ])
      const mergedMessages = new Set([
        ...childRequirements.messages,
        ...hydrationRequirements.messages,
        ...buildManifestEntry.messages,
      ])
      const mergedRoutes = new Set([
        ...childRequirements.routes,
        ...hydrationRequirements.routes,
        ...buildManifestEntry.routes,
      ])

      return {
        flashMessages: mergedFlashMessages,
        messages: mergedMessages,
        routes: mergedRoutes,
      }
    },
    initialRequirements ?? {
      flashMessages: new Set(),
      messages: new Set(),
      routes: new Set(),
    }
  )
}

/**
 * Generate the assets manifest
 */
export function generateAssetsManifest(buildManifest: Radonis.BuildManifest): Radonis.AssetsManifest {
  const assetsManifest = [] as Radonis.AssetsManifest

  for (const identifier in buildManifest) {
    const buildManifestEntry = buildManifest[identifier]

    if (buildManifestEntry.type === 'chunk') {
      /**
       * Should never occur since chunks
       * are not on the topmost level
       */
      continue
    }

    assetsManifest.push({
      type: buildManifestEntry.type,
      identifier: identifier,
      path: buildManifestEntry.publicPath,
      ...reduceHydrationRequirements(buildManifestEntry.imports, {
        flashMessages: buildManifestEntry.flashMessages,
        messages: buildManifestEntry.messages,
        routes: buildManifestEntry.routes,
      }),
    })
  }

  return assetsManifest
}

/**
 * Extract the required assets from the assets manifest
 */
export function extractRequiredAssets(
  assetsManifest: Radonis.AssetsManifest,
  requiredAssets: { components: Set<string> }
): Radonis.AssetsManifest {
  return assetsManifest.reduce<Radonis.AssetsManifest>((assets, asset) => {
    /**
     * Always include the entry file
     */
    if (asset.type === 'entry') {
      return [...assets, asset]
    }

    /**
     * Include the component if it is required
     */
    if (requiredAssets.components.has(asset.identifier)) {
      return [asset, ...assets]
    }

    return assets
  }, [])
}
