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
      const childResult = reduceHydrationRequirements(buildManifestEntry.imports)

      const mergedFlashMessages = new Set([
        ...childResult.flashMessages,
        ...hydrationRequirements.flashMessages,
        ...buildManifestEntry.flashMessages,
      ])
      const mergedMessages = new Set([
        ...childResult.messages,
        ...hydrationRequirements.messages,
        ...buildManifestEntry.messages,
      ])
      const mergeRoutes = new Set([
        ...childResult.routes,
        ...hydrationRequirements.routes,
        ...buildManifestEntry.routes,
      ])

      return {
        flashMessages: mergedFlashMessages,
        messages: mergedMessages,
        routes: mergeRoutes,
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
 * Generate the asset manifest
 */
export function generateAssetManifest(buildManifest: Radonis.BuildManifest): Radonis.AssetManifest {
  const assetManifest = [] as Radonis.AssetManifest

  for (const identifier in buildManifest) {
    const buildManifestEntry = buildManifest[identifier]

    if (buildManifestEntry.type === 'chunk') {
      /**
       * Should never occur since chunks
       * are not on the topmost level
       */
      continue
    }

    assetManifest.push({
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

  return assetManifest
}

/**
 * Extract the required assets from the asset manifest
 */
export function extractRequiredAssets(
  assetManifest: Radonis.AssetManifest,
  requiredAssets: { components: Set<string> }
): Radonis.AssetManifest {
  return assetManifest.reduce<Radonis.AssetManifest>((assets, asset) => {
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
