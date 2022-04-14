export function isClient(): boolean {
  return typeof window !== 'undefined'
}

export function isServer(): boolean {
  return typeof globalThis !== 'undefined' && !isClient()
}

export function getManifest(): Radonis.Manifest | undefined {
  return isServer() ? globalThis.rad_serverManifest : window.rad_clientManifest
}

export function getManifestOrFail(): Radonis.Manifest {
  const manifest = getManifest()

  if (!manifest) {
    throw new Error(
      `Could not get the Radonis manifest.
      Make sure the server provider is configured properly`
    )
  }

  return manifest
}
