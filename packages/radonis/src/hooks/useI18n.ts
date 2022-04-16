/*
 * @microeinhundert/radonis
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useMemo } from 'react'

import { I18n } from '../internal/I18n'
import { useHydration } from './useHydration'
import { useManifest } from './useManifest'

export function useI18n() {
  const { locale, messages } = useManifest()
  const hydration = useHydration()

  return useMemo(() => new I18n(locale, messages, !!hydration.root), [locale, messages, hydration])
}
