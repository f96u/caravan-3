import { formatDate } from '@/src/components/TodoRow/formatDate'
import '@testing-library/jest-dom'

describe('formatDate', () => {
  it('意図したフォーマットが返ってくるかを確認する', () => {
    const date = new Date(1704034800000)
    expect(formatDate(date)).toBe('2024-01-01')
  })
})
