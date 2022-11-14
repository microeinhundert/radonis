/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { serverContext } from "@microeinhundert/radonis-server/standalone";
import { useContext } from "react";

import { HookException } from "../../exceptions/hook_exception";

/**
 * Hook for retrieving the Radonis `ServerContract`
 * @see https://radonis.vercel.app/docs/hooks/use-server
 */
export function useServer() {
  const context = useContext(serverContext);

  if (!context) {
    throw HookException.cannotUseOnClient("useServer");
  }

  return context;
}
