import { getManifestOrFail } from '../utils/environment';

export const useManifest = () => {
  return getManifestOrFail();
};
