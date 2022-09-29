/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { stringifyAttributes } from '@microeinhundert/radonis-shared'
import type { HeadContract, HeadMeta, HeadTag, Resettable } from '@microeinhundert/radonis-types'

import { buildTitle } from './utils/buildTitle'

/**
 * @internal
 */
export class HeadManager implements HeadContract, Resettable {
  /**
   * The Radonis config
   */
  #config: RadonisConfig

  /**
   * The title
   */
  #title: string

  /**
   * The meta
   */
  #meta: HeadMeta

  /**
   * The tags
   */
  #tags: HeadTag[]

  /**
   * Constructor
   */
  constructor(application: ApplicationContract) {
    this.#config = application.container.resolveBinding('Microeinhundert/Radonis/Config')

    this.#setDefaults()
  }

  /**
   * Set the title
   */
  setTitle(title: string): void {
    const { prefix, suffix, separator } = this.#config.head.title

    this.#title = buildTitle(title, prefix, suffix, separator)
  }

  /**
   * Get the title HTML
   */
  getTitleHTML(): string {
    return `<title>${this.#title}</title>`
  }

  /**
   * Add meta
   */
  addMeta(meta: HeadMeta): void {
    this.#meta = { ...this.#meta, ...meta }
  }

  /**
   * Get the meta HTML
   */
  getMetaHTML(): string {
    return Object.entries(this.#meta)
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
  addTags(tags: HeadTag[]): void {
    this.#tags = [...this.#tags, ...tags]
  }

  /**
   * Get the tags HTML
   */
  getTagsHTML(): string {
    return this.#tags
      .map(({ name, content, attributes }) => {
        return `<${name}${attributes ? ` ${stringifyAttributes(attributes)}` : ''}>${content}</${name}>`
      })
      .join('\n')
  }

  /**
   * Get all HTML
   */
  getHTML(): string {
    return [this.getTitleHTML(), this.getMetaHTML(), this.getTagsHTML()].join('\n')
  }

  /**
   * Reset for a new request
   */
  reset(): void {
    this.#setDefaults()
  }

  /**
   * Set the defaults
   */
  #setDefaults() {
    this.setTitle(this.#config.head.title.default)
    this.#meta = this.#config.head.defaultMeta
    this.#tags = []
  }
}
