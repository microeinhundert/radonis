/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ComponentIdentifier } from '@microeinhundert/radonis-types'
import type { ReactElement } from 'react'

/**
 * Default error page props
 */
export interface DefaultErrorPageProps {
  error: unknown
}

/**
 * Hydration root props
 */
export interface HydrationRootProps {
  children: ReactElement<Record<string, any>>
  component: ComponentIdentifier
  className?: string
  disabled?: boolean
}
