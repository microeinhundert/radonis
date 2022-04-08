export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

export const isServer = (): boolean => {
  return typeof globalThis !== 'undefined' && !isClient();
};

export const getManifest = (): Radonis.Manifest | undefined => {
  return isServer() ? globalThis.ars_manifest : window.arc_manifest;
};

export const getManifestOrFail = () => {
  const manifest = getManifest();

  if (!manifest) {
    throw new Error('Missing manifest: make sure the server provider is configured properly');
  }

  return manifest;
};
