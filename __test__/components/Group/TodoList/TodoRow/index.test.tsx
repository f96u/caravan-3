import type { Schema } from '@/amplify/data/resource'
import { TodoRow } from '@/src/components/Group/TodoList/TodoRow'
import { amplifyClient } from '@/src/lib/amplifyClient'
import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

const mockTodo = (
  props: RecursivePartial<React.ComponentProps<typeof TodoRow>['todo']> = {},
) =>
  ({
    id: '1',
    content: 'content',
    executionDate: '2024-01-01',
    isDone: false,
    groupId: '1',
    group: {} as unknown,
    createdAt: new Date(1704034800000).toDateString(),
    updatedAt: new Date(1704034800000).toDateString(),
    ...props,
  }) as Schema['Todo']['type']

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P]
}

describe('TodoRow', () => {
  const createProps = (
    props: RecursivePartial<React.ComponentProps<typeof TodoRow>> = {},
  ): React.ComponentProps<typeof TodoRow> => ({
    ...props,
    todo: mockTodo(props.todo),
  })

  describe('チェックボックスの動作', () => {
    it('isDoneがfalseの時チェックなし', () => {
      act(() => {
        render(<TodoRow {...createProps()} />)
      })

      expect(screen.queryByTestId('check-icon')).toBeNull()
    })

    it('isDoneがtrueの時チェックあり', () => {
      act(() => {
        render(<TodoRow {...createProps({ todo: { isDone: true } })} />)
      })

      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })

    it('チェックボックスを押した時の動作', async () => {
      const spyUpdate = jest.spyOn(amplifyClient, 'update').mockResolvedValue({ data: mockTodo({ isDone: true }) })
      
      act(() => {
        render(<TodoRow {...createProps()} />)
      })
      
      expect(screen.queryByTestId('check-icon')).toBeNull()

      await act(async () => {
        fireEvent.click(screen.getByTestId('is-done'))
        expect(spyUpdate).toHaveBeenCalled()
      })
      // NOTE: Todoの状態が更新されていること
      expect(screen.queryByTestId('check-icon')).toBeInTheDocument()
    })
  })

  describe('contentの編集', () => {
    beforeEach(() => {
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

    describe('blur時', () => {
      let spyUpdate: jest.SpyInstance

      beforeEach(async () => {
        spyUpdate = jest.spyOn(amplifyClient, 'update').mockResolvedValue({ data: mockTodo({ content: 'change' }) })
        await act(async () => {
          fireEvent.blur(screen.getByTestId('edit-content'))
        })
      })

      it('modelsのupdateが走ること', () => {
        expect(spyUpdate).toHaveBeenCalled()
      })

      it('inputが消えていること', () => {
        expect(screen.queryByTestId('edit-content')).toBeNull()
      })

      it('更新された内容が表示されていること', () => {
        expect(screen.getByTestId('content')).toHaveTextContent('change')
      })
    })
  })

  describe('日付の編集', () => {
    beforeEach(() => {
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

    describe('blur時', () => {
      let spyUpdate: jest.SpyInstance

      beforeEach(async () => {
        spyUpdate = jest.spyOn(amplifyClient, 'update').mockResolvedValue({ data: mockTodo({ executionDate: '2024-12-31' }) })
        await act(async () => {
          fireEvent.blur(screen.getByTestId('edit-execution-date'))
        })
      })

      it('modelsのupdateが走ること', () => {
        expect(spyUpdate).toHaveBeenCalled()
      })

      it('inputが消えていること', () => {
        expect(screen.queryByTestId('edit-execution-date')).toBeNull()
      })

      it('更新された内容が表示されていること', () => {
        expect(screen.getByTestId('content')).toHaveTextContent('2024-12-31')
      })
    })
  })

  describe('削除', () => {
    let spyRemove: jest.SpyInstance

    beforeEach(async () => {
      spyRemove = jest.spyOn(amplifyClient, 'remove').mockResolvedValue({ data: mockTodo() })

      act(() => {
        render(<TodoRow {...createProps()} />)
      })

      await act(async () => {
        fireEvent.click(screen.getByTestId('remove'))
      })
    })

    it('removeが呼ばれること', async () => {
      expect(spyRemove).toHaveBeenCalled()
    })

    it('TodoRowが消えていること', () => {
      expect(screen.queryByTestId('todo-row')).toBeNull()
    })
  })
})
