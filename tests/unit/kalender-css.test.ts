import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return css.match(new RegExp(`${escaped}\\s*\\{[^}]+\\}`))?.[0] ?? ''
}

describe('kalender embed sizing CSS', () => {
  it('gives the calendar more width than the sidebar on desktop', () => {
    const grid = rule('.kalender-grid')
    expect(grid).toContain('display: grid')
    // Kalender-kolonnen (1.7fr) skal være bredere end sidebaren (1fr).
    expect(grid).toContain('minmax(0, 1.7fr) minmax(0, 1fr)')
  })

  it('makes the embedded calendar taller than the old 16/11 ratio on desktop', () => {
    expect(rule('.kalender-embed')).toContain('aspect-ratio: 16 / 13')
  })

  it('stacks to one column and uses a taller portrait ratio on mobile', () => {
    const mobileBlock = css.match(/@media \(max-width: 860px\)\s*\{[\s\S]*?\n\}/g) ?? []
    const joined = mobileBlock.join('\n')
    expect(joined).toContain('.kalender-grid')
    expect(joined).toMatch(/\.kalender-grid\s*\{\s*grid-template-columns:\s*1fr/)
    expect(joined).toMatch(/\.kalender-embed\s*\{\s*aspect-ratio:\s*3 \/ 4/)
  })
})
