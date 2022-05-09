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

function Head() {
  return (
    <HeadContextConsumer>
      {({ data }) => (
        <head>
          {Object.entries(data.meta).map(([name, value]) => {
            if (!value) {
              return null
            }

            if (typeof value === 'string' && ['charset', 'charSet'].includes(name)) {
              return <meta key="charset" charSet={value} />
            }

            if (typeof value === 'string' && name === 'title') {
              return <title key="title">{value}</title>
            }

            /*
             * Open Graph tags use the `property` attribute,
             * while other meta tags use `name`. See https://ogp.me/
             */
            const isOpenGraphTag = name.startsWith('og:')

            return [value].flat().map((content) => {
              if (isOpenGraphTag) {
                return <meta key={name + content} content={content as string} property={name} />
              }

              if (typeof content === 'string') {
                return <meta key={name + content} content={content} name={name} />
              }

              return <meta key={name + JSON.stringify(content)} {...content} />
            })
          })}
        </head>
      )}
    </HeadContextConsumer>
  )
}

interface DocumentProps {
  children: ReactNode
}

export function Document({ children }: DocumentProps) {
  const { locale } = useManifestBuilder()

  return (
    <html className="h-full bg-gray-100" lang={locale}>
      <Head />
      <body className="h-full">
        {children}
        <div id="rad-scripts" />
      </body>
    </html>
  )
}
