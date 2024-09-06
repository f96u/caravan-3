import type { Schema } from '@/amplify/data/resource'
import { TodoRow } from '@/src/components/TodoRow'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

jest.mock('aws-amplify/api', () => ({
  generateClient: jest.fn().mockImplementation(() => ({
    models: {
      Todo: {
        update: jest.fn().mockReturnValue({
          errors: undefined,
        }),
      },
    },
  })),
}))

describe('TodoRow', () => {
  const createMockTodo = (
    mockValue: Partial<Schema['Todo']['type']> = {},
  ): Schema['Todo']['type'] => ({
    content: 'content',
    executionDate: '2024-01-01',
    isDone: false,
    id: '1',
    createdAt: new Date(1704034800000).toDateString(),
    updatedAt: new Date(1704034800000).toDateString(),
    ...mockValue,
  })

  describe('チェックボックスの動作', () => {
    it('チェックなし', () => {
      act(() => {
        render(<TodoRow todo={createMockTodo()} />)
      })

      expect(screen.queryByTestId('check-icon')).toBeNull()
    })

    it('チェックあり', () => {
      act(() => {
        render(<TodoRow todo={createMockTodo({ isDone: true })} />)
      })

      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })
  })

  describe('contentの編集', () => {
    beforeEach(() => {
      act(() => {
        render(<TodoRow todo={createMockTodo()} />)
      })

      act(() => {
        fireEvent.click(screen.getByTestId('start-edit-content'))
      })
    })

    it('編集ボタンを押してinputが出ること', () => {
      expect(screen.getByTestId('edit-content')).toBeInTheDocument()
    })

    it('初期値がtodo.contentであること', () => {
      expect(screen.getByTestId('edit-content')).toHaveValue('content')
    })

    it('内容の編集ができること', () => {
      act(() => {
        fireEvent.change(screen.getByTestId('edit-content'), {
          target: { value: 'change' },
        })
      })
      expect(screen.getByTestId('edit-content')).toHaveValue('change')
    })

    it('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-content'))
      })

      expect(screen.queryByTestId('edit-content')).toBeNull()
    })
  })

  describe('日付の編集', () => {
    beforeEach(() => {
      act(() => {
        render(<TodoRow todo={createMockTodo()} />)
      })

      act(() => {
        fireEvent.click(screen.getByTestId('start-edit-execution-date'))
      })
    })

    it('編集ボタンを押してinputが出ること', () => {
      expect(screen.getByTestId('edit-execution-date')).toBeInTheDocument()
    })

    it('初期値がtodo.executionDateであること', () => {
      expect(screen.getByTestId('edit-execution-date')).toHaveValue(
        '2024-01-01',
      )
    })

    it('内容の編集ができること', () => {
      act(() => {
        fireEvent.change(screen.getByTestId('edit-execution-date'), {
          target: { value: '2024-12-31' },
        })
      })
      expect(screen.getByTestId('edit-execution-date')).toHaveValue(
        '2024-12-31',
      )
    })

    it('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-execution-date'))
      })

      expect(screen.queryByTestId('edit-execution-date')).toBeNull()
    })
  })
})
