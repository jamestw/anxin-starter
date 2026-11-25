import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatusChip } from './StatusChip'

describe('StatusChip', () => {
  it('顯示中文狀態，顏色走 trip token', () => {
    render(<StatusChip status="departed" />)
    const chip = screen.getByText('已出發')
    expect(chip).toHaveClass('bg-trip-departed-soft', 'text-trip-departed')
  })
})
