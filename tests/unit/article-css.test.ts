import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('article title CSS', () => {
  it('lets article titles use the full article width instead of balanced wrapping', () => {
    const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')
    const articleTitleRule = css.match(/\.article h1\s*\{[^}]+\}/)?.[0] ?? ''

    expect(articleTitleRule).toContain('max-width: none')
    expect(articleTitleRule).toContain('text-wrap: wrap')
  })
})
