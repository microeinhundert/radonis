/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createElement as h } from 'react'

import type { DocumentProps } from '../../types'
import { useManifestBuilder } from '../hooks/internal/useManifestBuilder'

/**
 * The component containing the minimum markup required for an HTML document
 * @internal
 */
export function Document({ children }: DocumentProps) {
  const manifestBuilder = useManifestBuilder()

  return h('html', { className: 'h-full', lang: manifestBuilder.locale }, [
    h('head'),
    h('body', { className: 'h-full' }, children),
  ])
}

Document.displayName = 'RadonisDocument'
