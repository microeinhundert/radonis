/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useGlobals } from "@microeinhundert/radonis";
import { Hydrate } from "@tanstack/react-query";
import { createElement as h } from "react";

import type { QueryHydratorProps } from "../types";

/**
 * Component for hydrating queries
 * @internal
 */
export function QueryHydrator({ children }: QueryHydratorProps) {
  const globals = useGlobals() as any;

  return h(Hydrate, { state: globals.dehydratedQueryState }, children);
}

QueryHydrator.displayName = "RadonisQueryHydrator";
