/*
 * @microeinhundert/radonis-server
 *
 * (c) Leon Seipp <l.seipp@microeinhundert.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RadonisConfig } from '@ioc:Microeinhundert/Radonis'
import { nonNull, stringifyAttributes } from '@microeinhundert/radonis-shared'
import type { HeadManagerContract, HeadMeta, HeadTag, Resettable } from '@microeinhundert/radonis-types'

import { buildTitle } from '../utils/build_title'

/**
 * Service for managing head data
 * @internal
 */
export class HeadManager implements HeadManagerContract, Resettable {
  /**
   * The singleton instance
   */
  static instance?: HeadManager

  /**
   * Get the singleton instance
   */
  static getSingletonInstance(...args: ConstructorParameters<typeof HeadManager>): HeadManager {
    return (HeadManager.instance = HeadManager.instance ?? new HeadManager(...args))
  }

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

  constructor(config: RadonisConfig) {
    this.#config = config

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
   * Get the title markup
   */
  #getTitleMarkup(): string {
    return `<title>${this.#title}</title>`
  }

  /**
   * Add meta
   */
  addMeta(meta: HeadMeta): void {
    this.#meta = { ...this.#meta, ...meta }
  }

  /**
   * Get the meta markup
   */
  #getMetaMarkup(): string {
    return nonNull(
      Object.entries(this.#meta).map(([name, value]) => {
        if (value === null || value === undefined) {
          return null
        }

        const isOpenGraphTag = /^(og|music|video|article|book|profile|fb):.+$/.test(name)
        const isCharsetTag = ['charset', 'charSet'].includes(name)

        if (isCharsetTag) {
          return `<meta ${stringifyAttributes({ charset: value })} />`
        }

        return `<meta ${stringifyAttributes({ value, [isOpenGraphTag ? 'property' : 'name']: name })} />`
      })
    ).join('\n')
  }

  /**
   * Add tags
   */
  addTags(tags: HeadTag[]): void {
    this.#tags = [...this.#tags, ...tags]
  }

  /**
   * Get the tags markup
   */
  #getTagsMarkup(): string {
    return this.#tags
      .map(({ name, content, attributes }) => {
        return `<${name}${attributes ? ` ${stringifyAttributes(attributes)}` : ''}>${content}</${name}>`
      })
      .join('\n')
  }

  /**
   * Get the markup, including the opening and closing head tags
   */
  getMarkup(): string {
    return ['<head>', this.#getTitleMarkup(), this.#getMetaMarkup(), this.#getTagsMarkup(), '</head>'].join('\n')
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
  #setDefaults(): void {
    this.setTitle(this.#config.head.title.default)
    this.#meta = this.#config.head.defaultMeta
    this.#tags = []
  }
}
