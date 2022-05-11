/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta } from '@ioc:Adonis/Addons/Radonis'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { DEFAULT_META } from './constants'

export class HeadManager {
  /**
   * The title
   */
  private title: string = this.application.appName

  /**
   * The meta data
   */
  private meta: HeadMeta = DEFAULT_META

  /**
   * Constructor
   */
  constructor(private application: ApplicationContract) {}

  /**
   * Set the title
   */
  public setTitle(title: string): void {
    this.title = title
  }

  /**
   * Add meta data
   */
  public addMeta(meta: HeadMeta): void {
    this.meta = { ...this.meta, ...meta }
  }

  /**
   * Get HTML title tag for the <head>
   */
  public getTitleTag(): string {
    return `<title>${this.title}</title>`
  }

  /**
   * Get HTML meta tags for the <head>
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
    this.title = this.application.appName
    this.meta = DEFAULT_META
  }
}
