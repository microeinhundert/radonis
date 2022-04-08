import { useEffect, useState } from 'react';

import { getManifestOrFail } from '../utils/environment';

export const useManifest = () => {
  const [manifest, setManifest] = useState<Radonis.Manifest>(getManifestOrFail());

  useEffect(() => {
    if (window.arc_manifest) setManifest(window.arc_manifest);
  }, []);

  return manifest;
};
