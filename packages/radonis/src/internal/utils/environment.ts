export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

export const isServer = (): boolean => {
  return typeof globalThis !== 'undefined' && !isClient();
};

export const getManifest = (): Radonis.Manifest | undefined => {
  return isServer() ? globalThis.rad_serverManifest : window.rad_clientManifest;
};

export const getManifestOrFail = () => {
  const manifest = getManifest();

  if (!manifest) {
    throw new Error(
      `Could not get the Radonis manifest.
      Make sure the server provider is configured properly`
    );
  }

  return manifest;
};
