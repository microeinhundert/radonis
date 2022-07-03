/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeadMeta, RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { separateArray, stringifyAttributes } from '@microeinhundert/radonis-shared'
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
   * The title
   */
  private title: string

  /**
   * The meta
   */
  private meta: HeadMeta

  /**
   * The data
   */
  private data: string[]

  /**
   * Constructor
   */
  constructor(private config: Pick<RadonisConfig, 'head'>) {
    this.setDefaults()
  }

  /**
   * Set defaults
   */
  private setDefaults() {
    this.setTitle(this.config.head.title.default)
    this.meta = this.config.head.defaultMeta
    this.data = []
  }

  /**
   * Set title
   */
  public setTitle(title: string): void {
    const { prefix, suffix, separator } = this.config.head.title

    this.title = buildTitle(title, prefix, suffix, separator)
  }

  /**
   * Add meta
   */
  public addMeta(meta: HeadMeta): void {
    this.meta = { ...this.meta, ...meta }
  }

  /**
   * Add data
   */
  public addData(data: string): void {
    this.data = [...this.data, data.trim()]
  }

  /**
   * Get the HTML title tag
   */
  public getTitleTag(): string {
    return `<title>${this.title}</title>`
  }

  /**
   * Get the HTML meta tags
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
            return `<meta ${stringifyAttributes(content)} />`
          }

          return `<meta content="${content}" ${isOpenGraphTag ? 'property' : 'name'}="${name}" />`
        })
      })
      .join('\n')
  }

  /**
   * Get the data
   */
  public getData(): string {
    return this.data.join('\n')
  }

  /**
   * Get all HTML
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
