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

export function useAdonis() {
  const context = useContext(adonisContext)

  return context
}
