/*
 * @microeinhundert/radonis-query
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import type { RouteIdentifier } from "@microeinhundert/radonis";
import { useUrlBuilder } from "@microeinhundert/radonis";
import { fetch$ } from "@microeinhundert/radonis-shared";
import { useQuery } from "@tanstack/react-query";

import type { ServerQueryOptions } from "../types";
import { useQueryBaseUrl } from "./use_query_base_url";

/**
 * Hook for querying server data in React components
 * @see https://radonis.vercel.app/docs/plugins/query#querying-data
 */
export function useServerQuery<TControllerAction extends (ctx: HttpContextContract) => any, TError = unknown>(
  routeIdentifier: RouteIdentifier,
  options?: ServerQueryOptions<Awaited<ReturnType<TControllerAction>>, TError>
) {
  const urlBuilder = useUrlBuilder();
  const baseUrl = useQueryBaseUrl();

  const url = urlBuilder.make(routeIdentifier, {
    baseUrl,
    params: options?.params,
    queryParams: options?.queryParams,
  });

  const urlQueryKey = url.replace(baseUrl ?? "", "").split("/");
  const queryKey = [routeIdentifier, urlQueryKey, options?.query?.queryKey].flat().filter(Boolean);

  const queryFn = async () => {
    const response = await fetch$(url, {
      headers: options?.headers,
    });

    return response.json<any>();
  };

  return useQuery<Awaited<ReturnType<TControllerAction>>, TError>({
    queryFn,
    ...options?.query,
    queryKey,
  });
}
