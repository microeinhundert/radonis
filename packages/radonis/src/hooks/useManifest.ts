import { getManifestOrFail } from '../internal/utils/environment';

export const useManifest = () => {
  return getManifestOrFail();
};
