import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import DeletePostButton from '@/components/admin/DeletePostButton'

describe('DeletePostButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('does not submit the form when the confirmation is cancelled', () => {
    const handleSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <form onSubmit={handleSubmit}>
        <DeletePostButton />
      </form>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Slet' }))

    expect(window.confirm).toHaveBeenCalledWith('Slet denne nyhed permanent?')
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('submits the form when the confirmation is accepted', () => {
    const handleSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })

    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <form onSubmit={handleSubmit}>
        <DeletePostButton />
      </form>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Slet' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
