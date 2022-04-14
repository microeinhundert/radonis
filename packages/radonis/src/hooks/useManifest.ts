import { getManifestOrFail } from '../internal/utils/environment'

export function useManifest() {
  return getManifestOrFail()
}
