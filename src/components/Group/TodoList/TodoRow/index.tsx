import type { Schema } from '@/amplify/data/resource'
import { Calendar } from '@/src/svgs/Calendar'
import { CheckIcon } from '@/src/svgs/CheckIcon'
import { PencilSquare } from '@/src/svgs/PencilSquare'
import { Trash } from '@/src/svgs/Trash'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { formatDate } from './formatDate'
import { useTodo } from './useTodo'
import { DragVertical } from '@/src/svgs/DragVertical'

type Props = {
  todo: Schema['Todo']['type']
}
export const TodoRow = ({ todo }: Props) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: todo.id })
  const { update, remove: removeTodo } = useTodo()
  const [editState, setEditState] = useState<
    null | 'content' | 'executionDate'
  >(null)
  const [tmpValue, setTmpValue] = useState('')

  const toggleDone = async () => {
    update({
      id: todo.id,
      isDone: !todo.isDone,
    })
  }

  const startEditContent = () => {
    setEditState('content')
    setTmpValue(todo.content ?? '')
  }

  const startEditExecutionDate = () => {
    setEditState('executionDate')
    setTmpValue(todo.executionDate ?? formatDate(new Date()))
  }

  const editContent = async () => {
    update({
      id: todo.id,
      content: tmpValue,
    })
    setEditState(null)
  }

  const editExecutionDate = async () => {
    update({
      id: todo.id,
      executionDate: tmpValue,
    })
    setEditState(null)
  }

  const remove = async () => {
    removeTodo(todo.id)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-2 border bg-white px-3 py-1"
    >
      <div ref={setActivatorNodeRef} {...attributes} {...listeners}><DragVertical className='size-3' /></div>
      <button
        data-testid="is-done"
        className="size-4 border"
        onClick={toggleDone}
      >
        {todo.isDone && <CheckIcon />}
      </button>
      {editState === 'content' ? (
        <input
          data-testid="edit-content"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
          onBlur={editContent}
        />
      ) : editState === 'executionDate' ? (
        <input
          data-testid="edit-execution-date"
          type="date"
          value={tmpValue}
          onChange={(e) => setTmpValue(e.target.value)}
          onBlur={editExecutionDate}
        />
      ) : (
        <div className="flex flex-grow justify-between">
          {todo.content}-{todo.executionDate}
          <div className="flex gap-1">
            <button data-testid="start-edit-content" onClick={startEditContent}>
              <PencilSquare className="size-4" />
            </button>
            <button
              data-testid="start-edit-execution-date"
              onClick={startEditExecutionDate}
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
  )
}
