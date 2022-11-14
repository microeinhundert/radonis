/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ManifestManagerContract } from "@microeinhundert/radonis-types";
import { createContext } from "react";

/**
 * @internal
 */
export const manifestManagerContext = createContext<ManifestManagerContract>(null as any);

/**
 * @internal
 */
export const ManifestManagerContextProvider = manifestManagerContext.Provider;
