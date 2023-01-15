/*
 * @microeinhundert/radonis-build
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  AssetsManifest,
  BuildManifest,
  BuildManifestEntry,
  HydrationRequirements,
} from '@microeinhundert/radonis-types'

/**
 * Extract the required assets from an assets manifest
 * @internal
 */
export function extractRequiredAssets(
  assetsManifest: AssetsManifest,
  requiredAssets: { islands: Set<string> }
): AssetsManifest {
  const extractedAssets = assetsManifest.reduce<AssetsManifest>((assets, asset) => {
    if (asset.type === 'client-script') {
      return [...assets, asset]
    }

    if (requiredAssets.islands.has(asset.hash)) {
      return [asset, ...assets]
    }

    return assets
  }, [])

  return extractedAssets
}

/**
 * Reduce the hydration requirements for a build manifest entry and its imports
 */
function reduceHydrationRequirements(
  buildManifestEntries: BuildManifestEntry[],
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
        flashMessages: Array.from(mergedFlashMessages),
        messages: Array.from(mergedMessages),
        routes: Array.from(mergedRoutes),
      }
    },
    initialRequirements ?? {
      flashMessages: [],
      messages: [],
      routes: [],
    }
  )
}

/**
 * Generate the assets manifest
 * @internal
 */
export function generateAssetsManifest(buildManifest: BuildManifest): AssetsManifest {
  return Object.entries(buildManifest).reduce<AssetsManifest>(
    (assetsManifest, [hash, { type, path, imports, ...entry }]) => {
      return [
        ...assetsManifest,
        {
          type,
          hash,
          path,
          ...reduceHydrationRequirements(imports, entry),
        },
      ]
    },
    []
  )
}
