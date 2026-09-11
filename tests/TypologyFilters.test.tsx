import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TypologyFilters } from '@/features/typologies/ui/TypologyFilters.tsx'

const options = [
  { value: null, label: 'Todas', count: 4 },
  { value: 1, label: '1 alcoba', count: 1 },
  { value: 2, label: '2 alcobas', count: 1 },
]

describe('TypologyFilters', () => {
  it('marks the active option for assistive technology', () => {
    render(<TypologyFilters options={options} selected={2} onSelect={() => {}} />)

    expect(screen.getByRole('tab', { name: /2 alcobas/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /Todas/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('reports the chosen value upwards instead of filtering by itself', async () => {
    const onSelect = vi.fn()
    render(<TypologyFilters options={options} selected={null} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('tab', { name: /1 alcoba/ }))

    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('shows how many typologies each option covers', () => {
    render(<TypologyFilters options={options} selected={null} onSelect={() => {}} />)

    expect(screen.getByRole('tab', { name: /Todas/ })).toHaveTextContent('4')
    expect(screen.getByRole('tab', { name: /1 alcoba/ })).toHaveTextContent('1')
  })
})
