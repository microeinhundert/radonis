/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { stringifyAttributes } from '@microeinhundert/radonis-shared'
import type { HeadContract, HeadMeta, HeadTag, ResetBetweenRequests } from '@microeinhundert/radonis-types'

import { buildTitle } from './utils/buildTitle'

/**
 * @internal
 */
export class HeadManager implements HeadContract, ResetBetweenRequests {
  /**
   * The title
   */
  private title: string

  /**
   * The meta
   */
  private meta: HeadMeta

  /**
   * The tags
   */
  private tags: HeadTag[]

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
    this.meta = this.config.head.defaultMeta
    this.tags = []
  }

  /**
   * Set the title
   */
  public setTitle(title: string): void {
    const { prefix, suffix, separator } = this.config.head.title

    this.title = buildTitle(title, prefix, suffix, separator)
  }

  /**
   * Get the HTML title tag
   */
  public getTitleTag(): string {
    return `<title>${this.title}</title>`
  }

  /**
   * Add meta
   */
  public addMeta(meta: HeadMeta): void {
    this.meta = { ...this.meta, ...meta }
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
          return `<meta ${stringifyAttributes({ charset: value })} />`
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

          return `<meta ${stringifyAttributes({ content, [isOpenGraphTag ? 'property' : 'name']: name })} />`
        })
      })
      .join('\n')
  }

  /**
   * Add tags
   */
  public addTags(tags: HeadTag[]): void {
    this.tags = [...this.tags, ...tags]
  }

  /**
   * Get the HTML tags
   */
  public getTags(): string {
    return this.tags
      .map(({ name, content, attributes }) => {
        return `<${name}${attributes ? ` ${stringifyAttributes(attributes)}` : ''}>${content}</${name}>`
      })
      .join('\n')
  }

  /**
   * Get all HTML
   */
  public getHTML(): string {
    return [this.getTitleTag(), this.getMetaTags(), this.getTags()].join('\n')
  }

  /**
   * Reset for a new request
   */
  public resetForNewRequest(): void {
    this.setDefaults()
  }
}
