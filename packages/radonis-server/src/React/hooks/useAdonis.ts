/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useContext } from 'react'

import { adonisContext } from '../contexts/adonisContext'

/**
 * Hook for retrieving data from the AdonisJS instance
 * @see https://radonis.vercel.app/docs/hooks/use-adonis
 */
export function useAdonis() {
  const context = useContext(adonisContext)

  return context
}
