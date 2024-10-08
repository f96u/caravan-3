import type { Schema } from '@/amplify/data/resource'
import { amplifyClient } from '@/src/lib/amplifyClient'
import { Calendar } from '@/src/svgs/Calendar'
import { CheckIcon } from '@/src/svgs/CheckIcon'
import { DragVertical } from '@/src/svgs/DragVertical'
import { PencilSquare } from '@/src/svgs/PencilSquare'
import { Trash } from '@/src/svgs/Trash'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { formatDate } from './formatDate'

type Props = {
  todo: Schema['Todo']['type']
}

export const TodoRow = ({ todo: initTodo }: Props) => {
  const [todo, setTodo] = useState<Schema['Todo']['type'] | null>(initTodo)
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: initTodo.id })
  const [editState, setEditState] = useState<
    null | 'content' | 'executionDate'
  >(null)
  const [tmpValue, setTmpValue] = useState('')

  const update = async (
    models: Pick<
      Schema['Todo']['type'],
      'content' | 'isDone' | 'executionDate'
    >,
  ) => {
    if (!todo) {
      return
    }
    const { data, errors } = await amplifyClient.update('Todo', {
      id: todo.id,
      content: models.content,
      isDone: models.isDone,
      executionDate: models.executionDate,
    })

    if (!errors) {
      setTodo(data)
      setEditState(null)
    }
  }

  const remove = async () => {
    if (!todo) {
      return
    }

    const { errors } = await amplifyClient.remove('Todo', {
      id: todo.id,
    })

    if (!errors) {
      setTodo(null)
    }
  }

  const startEdit = (editState: 'content' | 'executionDate') => {
    if (!todo) {
      return
    }

    setEditState(editState)
    switch (editState) {
      case 'content':
        setTmpValue(todo.content ?? '')
        return
      case 'executionDate':
        setTmpValue(todo.executionDate ?? formatDate(new Date()))
    }
  }

  return todo ? (
    <div
      data-testid="todo-row"
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2 border bg-white px-3 py-1"
    >
      <div ref={setActivatorNodeRef} {...attributes} {...listeners}>
        <DragVertical className="size-3" />
      </div>
      <button
        data-testid="is-done"
        className="size-4 border"
        onClick={() => update({ isDone: !todo.isDone })}
      >
        {todo.isDone && <CheckIcon />}
      </button>
      {editState === 'content' ? (
        <input
          data-testid="edit-content"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
          onBlur={() => update({ content: tmpValue })}
        />
      ) : editState === 'executionDate' ? (
        <input
          data-testid="edit-execution-date"
          type="date"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
          onBlur={() => update({ executionDate: tmpValue })}
        />
      ) : (
        <div className="flex grow justify-between">
          <span data-testid="content">
            {todo.content}-{todo.executionDate}
          </span>
          <div className="flex gap-1">
            <button
              data-testid="start-edit-content"
              onClick={() => startEdit('content')}
            >
              <PencilSquare className="size-4" />
            </button>
            <button
              data-testid="start-edit-execution-date"
              onClick={() => startEdit('executionDate')}
            >
              <Calendar className="size-4" />
            </button>
            <button data-testid="remove" onClick={remove}>
              <Trash className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  ) : null
}
