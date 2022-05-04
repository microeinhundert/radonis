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
      flashMessages: buildManifestEntry.imports.reduce((acc, { flashMessages }) => {
        return new Set([...acc, ...flashMessages])
      }, buildManifestEntry.flashMessages),
      messages: buildManifestEntry.imports.reduce((acc, { messages }) => {
        return new Set([...acc, ...messages])
      }, buildManifestEntry.messages),
      routes: buildManifestEntry.imports.reduce((acc, { routes }) => {
        return new Set([...acc, ...routes])
      }, buildManifestEntry.routes),
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
