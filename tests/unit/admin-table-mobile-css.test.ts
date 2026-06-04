import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

describe('admin table mobile card view CSS', () => {
  it('no longer forces a horizontal scroll on admin tables', () => {
    expect(css).not.toContain('min-width: 720px')
    expect(css).not.toContain('overflow-x: auto')
  })

  it('stacks each row as a card with a data-label heading on mobile', () => {
    expect(css).toContain('content: attr(data-label)')
  })
})
