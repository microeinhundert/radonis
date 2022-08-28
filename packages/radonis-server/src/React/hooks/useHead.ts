/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta, HeadTag } from '@ioc:Microeinhundert/Radonis'
import { useContext } from 'react'

import { headManagerContext } from '../contexts/headManagerContext'

export function useHead() {
  const context = useContext(headManagerContext)

  return {
    setTitle: (title: string): void => {
      context.setTitle(title)
    },
    addMeta: (meta: HeadMeta): void => {
      context.addMeta(meta)
    },
    addTags: (tags: HeadTag[]): void => {
      context.addTags(tags)
    },
  }
}
