import { TodoRow } from '@/src/components/TodoList/TodoRow'
import { useTodo } from '@/src/components/TodoList/useTodo'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

const mockTodo = (
  props: Partial<React.ComponentProps<typeof TodoRow>['todo']> = {},
) => ({
  content: 'content',
  executionDate: '2024-01-01',
  isDone: false,
  id: '1',
  createdAt: new Date(1704034800000).toDateString(),
  updatedAt: new Date(1704034800000).toDateString(),
  ...props,
})

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

jest.mock('@/src/components/TodoList/useTodo')

const mockUseTodo = jest.mocked(useTodo)

describe('TodoRow', () => {
  const createProps = (
    props: RecursivePartial<React.ComponentProps<typeof TodoRow>> = {},
  ): React.ComponentProps<typeof TodoRow> => ({
    ...props,
    todo: mockTodo(props.todo),
  })

  describe('チェックボックスの動作', () => {
    it('チェックなし', () => {
      act(() => {
        render(<TodoRow {...createProps()} />)
      })

      expect(screen.queryByTestId('check-icon')).toBeNull()
    })

    it('チェックあり', () => {
      act(() => {
        render(<TodoRow {...createProps({ todo: { isDone: true } })} />)
      })

      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })

    it('updateが発火すること', () => {
      const update = jest.fn()
      mockUseTodo.mockImplementation(() => ({
        todos: [mockTodo()],
        update,
        remove: jest.fn(),
      }))

      act(() => {
        render(<TodoRow {...createProps()} />)
      })

      act(() => {
        fireEvent.click(screen.getByTestId('is-done'))
      })

      expect(update).toHaveBeenCalledWith({
        id: '1',
        isDone: true,
      })
    })
  })

  describe('contentの編集', () => {
    let update: jest.Mock

    beforeEach(() => {
      update = jest.fn()
      mockUseTodo.mockImplementation(() => ({
        todos: [mockTodo()],
        update,
        remove: jest.fn(),
      }))

      act(() => {
        render(<TodoRow {...createProps()} />)
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

    it('blur時にmodelsのupdateが走ること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-content'))
      })

      expect(update).toHaveBeenCalledWith({
        id: '1',
        content: 'content',
      })
    })

    it('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-content'))
      })

      expect(screen.queryByTestId('edit-content')).toBeNull()
    })
  })

  describe('日付の編集', () => {
    let update: jest.Mock

    beforeEach(() => {
      update = jest.fn()
      mockUseTodo.mockImplementation(() => ({
        todos: [mockTodo()],
        update,
        remove: jest.fn(),
      }))

      act(() => {
        render(<TodoRow {...createProps()} />)
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

    it('blur時にmodelsのupdateが走ること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-execution-date'))
      })

      expect(update).toHaveBeenCalledWith({
        id: '1',
        executionDate: '2024-01-01',
      })
    })

    it('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-execution-date'))
      })

      expect(screen.queryByTestId('edit-execution-date')).toBeNull()
    })
  })

  it('削除時にremoveが呼ばれること', () => {
    const remove = jest.fn()
    mockUseTodo.mockImplementation(() => ({
      todos: [mockTodo()],
      update: jest.fn(),
      remove,
    }))

    act(() => {
      render(<TodoRow {...createProps()} />)
    })

    act(() => {
      fireEvent.click(screen.getByTestId('remove'))
    })

    expect(remove).toHaveBeenCalledWith('1')
  })
})
