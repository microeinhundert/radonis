/**
 * Normalize whitespace
 */
function normalizeWhitespace(source: string): string {
  return source
    .replace(/\s\s+/g, ' ')
    .trim()
    .replaceAll(/\s+`|`\s+?/gs, '`')
}

/**
 * Replace matches
 */
function replace(matchers: RegExp[], replacer: (content: string) => string, source: string): string {
  let result = source

  for (const matcher of matchers) {
    for (const match of source.matchAll(matcher)) {
      const { content } = match.groups ?? {}

      if (!content) continue

      result = result.replace(content, replacer.apply(null, [content]))
    }
  }

  return result
}

/**
 * Minify content inside `tx` tagged template literals
 */
export function minifyTxLiterals(source: string): string {
  return replace(
    [new RegExp(/tx\((?<content>.*?)\)/gs), new RegExp(/tx`(?<content>.*?)`/gs)],
    (content) => normalizeWhitespace(content.replaceAll(/\s+`|`\s+?/gs, '`')),
    source
  )
}
