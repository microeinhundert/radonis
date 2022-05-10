/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react'

interface HeadProps {
  meta: Radonis.HTMLMetaDescriptor
}

export function Head({ meta }: HeadProps) {
  return (
    <head>
      {Object.entries(meta).map(([name, value]) => {
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
          if (typeof content !== 'string') {
            return <meta key={name + JSON.stringify(content)} {...content} />
          }

          if (isOpenGraphTag) {
            return <meta key={name + content} content={content} property={name} />
          }

          return <meta key={name + content} content={content} name={name} />
        })
      })}
    </head>
  )
}
