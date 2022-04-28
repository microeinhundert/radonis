/**
 * Minify content inside `tx` tagged template literals
 */
export function minifyTxLiterals(source: string): string {
  const matches = source.matchAll(/tx(.)?\`(?<content>.*?)\`/gs)

  for (const match of matches) {
    const { content } = match.groups ?? {}

    if (!content) continue

    source = source.replace(content, content.replace(/\s\s+/g, ' ').trim())
  }

  return source
}
