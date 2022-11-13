/*
 * @microeinhundert/radonis-hooks
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useCallback, useRef } from "react";

/**
 * @internal
 */
export function useGetLatest<TValue>(value: TValue): () => TValue {
  const ref = useRef<TValue>(value);
  ref.current = value;

  return useCallback(() => ref.current, []);
}
