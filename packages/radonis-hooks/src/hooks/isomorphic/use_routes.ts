/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useHydration } from "@microeinhundert/radonis-hydrate";

import { hydrationManager } from "../../singletons";
import { useManifest } from "./use_manifest";

/**
 * Hook for retrieving all routes available in the application
 * @see https://radonis.vercel.app/docs/hooks/use-routes
 */
export function useRoutes() {
  const { routes } = useManifest();
  const hydration = useHydration();

  if (hydration.id) {
    hydrationManager.requireRoute("*");
  }

  return routes;
}
