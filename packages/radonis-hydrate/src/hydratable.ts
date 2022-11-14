/*
 * @microeinhundert/radonis-hydrate
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentIdentifier } from "@microeinhundert/radonis-types";
import type { ComponentType } from "react";

import { hydrator } from "./singletons";
import { componentIdentifierSymbol } from "./symbols";

/**
 * Mark a component as hydratable
 * @see https://radonis.vercel.app/docs/components#hydrating-components
 */
export function hydratable<T extends ComponentType<any>>(identifier: ComponentIdentifier, Component: T): T {
  /**
   * Register the component on the Hydrator
   */
  hydrator.registerComponent(identifier, Component);

  /**
   * Set the component identifier on the component
   */
  Component[componentIdentifierSymbol] = identifier;

  return Component;
}
