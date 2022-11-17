/*
 * @microeinhundert/radonis-shared
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteIdentifier, RouteParams, RouteQueryParams, Routes } from "@microeinhundert/radonis-types";

import { CannotFindRouteException } from "../exceptions/cannot_find_route";
import { MissingRouteParamException } from "../exceptions/missing_route_param";
import { WildcardRoutesNotSupportedException } from "../exceptions/wildcard_routes_not_supported";
import type { UrlBuilderMakeOptions, UrlBuilderOptions } from "../types";

/**
 * Helper for building URLs to routes
 */
export class UrlBuilder {
  /**
   * The routes
   */
  #routes: Routes;

  /**
   * The options
   */
  #options?: UrlBuilderOptions;

  /**
   * Constructor
   */
  constructor(routes: Routes, options?: UrlBuilderOptions) {
    this.#routes = routes;
    this.#options = options;
  }

  /**
   * Make URL for given route
   */
  make(identifier: RouteIdentifier, options?: UrlBuilderMakeOptions) {
    const route = this.#findRouteOrFail(identifier);
    const path = this.#processPattern(route, options?.params ?? {});
    const pathWithQueryString = this.#suffixWithQueryString(path, options?.queryParams ?? {});

    return [options?.baseUrl, pathWithQueryString].filter(Boolean).join("");
  }

  /**
   * Process pattern with params
   */
  #processPattern(pattern: string, params: RouteParams) {
    let path = pattern;

    if (path.includes("*")) {
      throw new WildcardRoutesNotSupportedException();
    }

    if (path.includes(":")) {
      /*
       * Split pattern when route has dynamic segments
       */
      const tokens = path.split("/");

      /*
       * Replace tokens with values
       */
      path = tokens
        .map((token) => {
          if (!token.startsWith(":")) {
            return token;
          }

          const isOptional = token.endsWith("?");
          const paramName = token.replace(/^:/, "").replace(/\?$/, "");
          const paramValue = params[paramName];

          if (!paramValue && !isOptional) {
            throw new MissingRouteParamException(paramName, pattern);
          }

          return paramValue;
        })
        .filter(Boolean)
        .join("/");
    }

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    return path;
  }

  /**
   * Suffix path with query string
   */
  #suffixWithQueryString(path: string, queryParams: RouteQueryParams) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item.toString()));
      } else {
        params.set(key, value.toString());
      }
    }

    const encodedParams = params.toString();
    path = encodedParams ? `${path}?${encodedParams}` : path;

    return path;
  }

  /**
   * Find the route inside the registered routes and
   * raise exception when unable to
   */
  #findRouteOrFail(identifier: RouteIdentifier) {
    const route = this.#routes[identifier];

    if (!route) {
      throw new CannotFindRouteException(identifier);
    }

    this.#options?.onFoundRoute?.(identifier);

    return route;
  }
}
