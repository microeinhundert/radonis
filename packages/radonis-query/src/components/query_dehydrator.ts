/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useFlushEffect, useRenderer } from "@microeinhundert/radonis";
import { dehydrate, useQueryClient } from "@tanstack/react-query";

import type { QueryDehydratorProps } from "../types";

/**
 * The component for dehydrating queries
 * @internal
 */
export function QueryDehydrator({ children }: QueryDehydratorProps) {
  const renderer = useRenderer();
  const queryClient = useQueryClient();

  useFlushEffect(() => {
    renderer.withGlobals({ dehydratedQueryState: dehydrate(queryClient) });
  });

  return children;
}

QueryDehydrator.displayName = "RadonisQueryDehydrator";
