/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from "react";

import { hydrationContext } from "../contexts/hydration_context";

/**
 * Hook for retrieving info about the closest {@link https://radonis.vercel.app/docs/components#hydrating-components HydrationRoot}
 * @see https://radonis.vercel.app/docs/hooks/use-hydration
 */
export function useHydration() {
  const context = useContext(hydrationContext);

  return context;
}
