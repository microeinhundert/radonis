/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ReactNode } from 'react'
import React from 'react'

import { HeadContextConsumer } from '../contexts/headContext'
import { useManifestBuilder } from '../hooks/useManifestBuilder'
import { Head } from './Head'

interface DocumentProps {
  children: ReactNode
}

export function Document({ children }: DocumentProps) {
  const manifestBuilder = useManifestBuilder()

  return (
    <html className="h-full bg-gray-100" lang={manifestBuilder.locale}>
      <HeadContextConsumer>{({ data }) => <Head {...data} />}</HeadContextConsumer>
      <body className="h-full">
        {children}
        <div id="rad-scripts" />
      </body>
    </html>
  )
}
