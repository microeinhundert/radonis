/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta, RadonisConfig } from '@ioc:Adonis/Addons/Radonis'

export class HeadManager {
  /**
   * The page <title>
   */
  private title: string

  /**
   * The page <meta>
   */
  private meta: HeadMeta

  /**
   * Constructor
   */
  constructor(private config: RadonisConfig) {
    this.title = config.head.title
    this.meta = config.head.meta
  }

  /**
   * Set the page <title>
   */
  public setTitle(title: string): void {
    this.title = title
  }

  /**
   * Add page <meta>
   */
  public addMeta(meta: HeadMeta): void {
    this.meta = { ...this.meta, ...meta }
  }

  /**
   * Get the HTML <title> tag for the <head>
   */
  public getTitleTag(): string {
    return `<title>${this.title}</title>`
  }

  /**
   * Get the HTML <meta> tags for the <head>
   */
  public getMetaTags(): string {
    return Object.entries(this.meta)
      .map(([name, value]) => {
        if (!value) {
          return null
        }

        if (['charset', 'charSet'].includes(name)) {
          return `<meta charset="${value}" />`
        }

        /*
         * Open Graph tags use the `property` attribute,
         * while other meta tags use `name`. See https://ogp.me/
         */
        const isOpenGraphTag = name.startsWith('og:')

        return [value].flat().map((content) => {
          if (typeof content !== 'string') {
            return `<meta ${Object.entries(content)
              .map(([attrName, attrValue]) => `${attrName}="${attrValue}"`)
              .join(' ')} />`
          }

          return `<meta content="${content}" ${isOpenGraphTag ? 'property' : 'name'}="${name}" />`
        })
      })
      .join('\n')
  }

  /**
   * Get all HTML tags for the <head>
   */
  public getTags(): string {
    return [this.getTitleTag(), this.getMetaTags()].join('\n')
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.title = this.config.head.title
    this.meta = this.config.head.meta
  }
}
