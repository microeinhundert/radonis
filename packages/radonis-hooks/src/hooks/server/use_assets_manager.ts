/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { assetsManagerContext } from "@microeinhundert/radonis-server/standalone";
import { useContext } from "react";

import { CannotUseOnClientException } from "../../exceptions/cannot_use_on_client";

/**
 * Hook for retrieving the Radonis `AssetsManagerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-assets-manager
 */
export function useAssetsManager() {
  const context = useContext(assetsManagerContext);

  if (!context) {
    throw new CannotUseOnClientException("useAssetsManager");
  }

  return context;
}
