/*
 * @microeinhundert/radonis-form
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMutation, useUrlBuilder } from "@microeinhundert/radonis-hooks";
import { useHydration } from "@microeinhundert/radonis-hydrate";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import superjson from "superjson";

import { CannotFetchWithoutHydrationException } from "../exceptions/cannot_fetch_without_hydration";
import { CannotUseHooksWhenReloadingException } from "../exceptions/cannot_use_hooks_when_reloading";
import { RequestFailedException } from "../exceptions/request_failed";
import { hydrationManager } from "../singletons";
import type { FormOptions } from "../types";

/**
 * Check if a method is natively supported by the form element
 */
function isNativeFormMethod(method: string): boolean {
  return ["get", "post"].includes(method);
}

/**
 * Convert an URL to a relative path
 */
function urlToRelativePath(url: URL): string {
  return url.toString().replace(url.origin, "");
}

/**
 * Hook for creating forms
 * @see https://radonis.vercel.app/docs/hooks/use-form
 */
export function useForm<TData, TError>({
  action,
  params,
  queryParams,
  method,
  hooks,
  noReload,
  throwOnFailure,
  useErrorBoundary,
  ...props
}: FormOptions<TData, TError>) {
  const hydration = useHydration();

  if (hydration.id) {
    hydrationManager.requireRoute(action);
  }

  if (!noReload && hooks) {
    throw new CannotUseHooksWhenReloadingException(action);
  }

  if (noReload && !hydration.id) {
    throw new CannotFetchWithoutHydrationException(action);
  }

  const formRef = useRef<HTMLFormElement | null>(null);
  const urlBuilder = useUrlBuilder();

  const requestUrl = useMemo(
    () => new URL(urlBuilder.make(action, { params, queryParams }), "http://internal"),
    [urlBuilder, action, params, queryParams]
  );

  const [mutate, { status, data, error }] = useMutation<FormData, TData, TError>(
    async (formData: FormData) => {
      const requestInit: RequestInit = {
        method,
        headers: {
          "Accept": "application/json",
          "X-Radonis-Request": "true",
        },
      };

      switch (method) {
        case "get": {
          for (const entity of formData.entries()) {
            requestUrl.searchParams.append(entity[0], entity[1].toString());
          }

          break;
        }
        default: {
          requestInit.body = formData;
        }
      }

      const response = await fetch(urlToRelativePath(requestUrl), requestInit);

      if (!response.ok) {
        throw new RequestFailedException(action, response.status);
      }

      const json = await response.json();

      return superjson.deserialize(json);
    },
    { ...(hooks ?? {}), throwOnFailure, useErrorBoundary }
  );

  const submitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (event.defaultPrevented) return;
      event.preventDefault();

      mutate(new FormData(event.currentTarget));
    },
    [mutate]
  );

  const getFormProps = () => ({
    onSubmit: noReload ? submitHandler : undefined,
    ref: formRef,
    ...props,
    get action() {
      const actionUrl = new URL(requestUrl);

      if (!isNativeFormMethod(method)) {
        actionUrl.searchParams.append("_method", method);
      }

      return urlToRelativePath(actionUrl);
    },
    get method() {
      return isNativeFormMethod(method) ? method : "post";
    },
  });

  return {
    status,
    data,
    error,
    ref: formRef,
    getFormProps,
  };
}
