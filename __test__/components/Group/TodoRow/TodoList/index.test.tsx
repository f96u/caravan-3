import type { Schema } from '@/amplify/data/resource'
import { TodoRow } from '@/src/components/Group/TodoList/TodoRow'
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

    it.todo('client.modelsのupdateが呼ばれること')

    it.todo('updateの後にtodoが更新され、editStateが元に戻ること')
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

    it.todo('blur時にmodelsのupdateが走ること')

    it.skip('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-content'))
      })

      expect(screen.queryByTestId('edit-content')).toBeNull()
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
    
    it.todo('blur時にmodelsのupdateが走ること')

    it.skip('blur時にinputが消えていること', async () => {
      await act(async () => {
        fireEvent.blur(screen.getByTestId('edit-execution-date'))
      })

      expect(screen.queryByTestId('edit-execution-date')).toBeNull()
    })
  })

  it.todo('削除時にremoveが呼ばれること')
})
