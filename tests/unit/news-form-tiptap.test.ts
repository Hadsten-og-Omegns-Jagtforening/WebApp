import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('NewsForm TipTap SSR config', () => {
  it('disables immediate render to avoid TipTap SSR crashes', () => {
    const source = readFileSync(join(process.cwd(), 'components/admin/NewsForm.tsx'), 'utf8')

    expect(source).toContain('immediatelyRender: false')
  })

  it('does not register TipTap extensions that StarterKit already includes', () => {
    const source = readFileSync(join(process.cwd(), 'components/admin/NewsForm.tsx'), 'utf8')

    expect(source).not.toContain("@tiptap/extension-underline")
    expect(source).not.toContain("@tiptap/extension-link")
    expect(source).toContain('link: { openOnClick: false }')
  })

  it('keeps the editor selection when toolbar buttons are pressed', () => {
    const source = readFileSync(join(process.cwd(), 'components/admin/NewsForm.tsx'), 'utf8')

    expect(source).toContain('onMouseDown={preventToolbarMouseDown}')
    expect(source).toContain('event.preventDefault()')
  })
})
