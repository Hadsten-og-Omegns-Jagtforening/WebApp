import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ResultsBuilder from '@/components/admin/ResultsBuilder'

describe('ResultsBuilder', () => {
  it('adds, edits, and removes result rows', () => {
    const onChange = vi.fn()

    render(<ResultsBuilder initialResults={[{ rank: '1', name: 'Jens', score: '23' }]} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /\+ Tilf/i }))
    expect(onChange).toHaveBeenLastCalledWith([
      { rank: '1', name: 'Jens', score: '23' },
      { rank: '', name: '', score: '' },
    ])

    const nameInputs = screen.getAllByPlaceholderText('Navn')
    fireEvent.change(nameInputs[1], { target: { value: 'Poul' } })
    expect(onChange).toHaveBeenLastCalledWith([
      { rank: '1', name: 'Jens', score: '23' },
      { rank: '', name: 'Poul', score: '' },
    ])

    const removeButtons = screen.getAllByTitle('Fjern')
    fireEvent.click(removeButtons[0])
    expect(onChange).toHaveBeenLastCalledWith([
      { rank: '', name: 'Poul', score: '' },
    ])
  })
})
