/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { DocumentProps } from '../../types'
import { useManifestBuilder } from '../hooks/internal/useManifestBuilder'

/**
 * The component containing the minimum markup required for an HTML document
 * @internal
 */
export function Document({ children }: DocumentProps) {
  const manifestBuilder = useManifestBuilder()

  return (
    <html className="h-full" lang={manifestBuilder.locale}>
      <head></head>
      <body className="h-full">{children}</body>
    </html>
  )
}

Document.displayName = 'RadonisDocument'
