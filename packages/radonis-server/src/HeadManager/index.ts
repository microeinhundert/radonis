/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta, RadonisConfig } from '@ioc:Adonis/Addons/Radonis'
import { separateArray } from '@microeinhundert/radonis-shared'

/**
 * Build the title
 */
function buildTitle(title: string, prefix: string, suffix: string, separator: string): string {
  return separateArray(
    [prefix, title, suffix].filter(Boolean).map((part) => part.trim()),
    separator
  ).join(' ')
}

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
    this.setDefaults()
  }

  /**
   * Set the defaults
   */
  private setDefaults() {
    this.setTitle(this.config.head.title.default)
    this.addMeta(this.config.head.defaultMeta)
  }

  /**
   * Set the page <title>
   */
  public setTitle(title: string): void {
    const { prefix, suffix, separator } = this.config.head.title

    this.title = buildTitle(title, prefix, suffix, separator)
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
    this.setDefaults()
  }
}
