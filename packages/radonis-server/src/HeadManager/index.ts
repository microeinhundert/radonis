/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta, RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { generateHTMLAttributesString, separateArray } from '@microeinhundert/radonis-shared'
import type { UniqueBetweenRequests } from '@microeinhundert/radonis-types'

/**
 * Build the title
 */
function buildTitle(title: string, prefix: string, suffix: string, separator: string): string {
  return separateArray(
    [prefix, title, suffix].filter(Boolean).map((part) => part.trim()),
    separator
  ).join(' ')
}

export class HeadManager implements UniqueBetweenRequests {
  /**
   * The page head title
   */
  private title: string

  /**
   * The page head meta
   */
  private meta: HeadMeta

  /**
   * The page head data
   */
  private data: string[]

  /**
   * Constructor
   */
  constructor(private config: Pick<RadonisConfig, 'head'>) {
    this.setDefaults()
  }

  /**
   * Set the defaults
   */
  private setDefaults() {
    this.setTitle(this.config.head.title.default)
    this.addMeta(this.config.head.defaultMeta, true)
    this.addData('', true)
  }

  /**
   * Set the page head title
   */
  public setTitle(title: string): void {
    const { prefix, suffix, separator } = this.config.head.title

    this.title = buildTitle(title, prefix, suffix, separator)
  }

  /**
   * Add page head meta
   */
  public addMeta(meta: HeadMeta, override?: boolean): void {
    this.meta = override ? meta : { ...this.meta, ...meta }
  }

  /**
   * Add page head data
   */
  public addData(data: string, override?: boolean): void {
    this.data = override ? [data] : [...this.data, data]
  }

  /**
   * Get the HTML title tag for the head
   */
  public getTitleTag(): string {
    return `<title>${this.title}</title>`
  }

  /**
   * Get the HTML meta tags for the head
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
            return `<meta ${generateHTMLAttributesString(content)} />`
          }

          return `<meta content="${content}" ${isOpenGraphTag ? 'property' : 'name'}="${name}" />`
        })
      })
      .join('\n')
  }

  /**
   * Get the data for the head
   */
  public getData(): string {
    return this.data.join('\n')
  }

  /**
   * Get all HTML for the head
   */
  public getHTML(): string {
    return [this.getTitleTag(), this.getMetaTags(), this.getData()].join('\n')
  }

  /**
   * Prepare for a new request
   */
  public prepareForNewRequest(): void {
    this.setDefaults()
  }
}
