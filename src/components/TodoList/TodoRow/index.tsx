import type { Schema } from '@/amplify/data/resource'
import { Calendar } from '@/src/svgs/Calendar'
import { CheckIcon } from '@/src/svgs/CheckIcon'
import { PencilSquare } from '@/src/svgs/PencilSquare'
import { Trash } from '@/src/svgs/Trash'
import { useState } from 'react'
import { useTodo } from '../useTodo'
import { formatDate } from './formatDate'

type Props = {
  todo: Schema['Todo']['type']
}
export const TodoRow = ({ todo }: Props) => {
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
    <>
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
        <>
          {todo.content}-{todo.executionDate}
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
        </>
      )}
    </>
  )
}
