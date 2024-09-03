import type { Schema } from '@/amplify/data/resource'
import { Calendar } from '@/src/svgs/Calendar'
import { CheckIcon } from '@/src/svgs/CheckIcon'
import { PencilSquare } from '@/src/svgs/PencilSquare'
import { Trash } from '@/src/svgs/Trash'
import { generateClient } from 'aws-amplify/api'
import { useState } from 'react'
import { formatDate } from './formatDate'

const client = generateClient<Schema>()

type Props = {
  todo: Schema['Todo']['type']
}
export const TodoRow = ({ todo }: Props) => {
  const [isEditContent, setIsEditContent] = useState(false)
  const [isEditExecutionDate, setIsEditExecutionDate] = useState(false)
  const [tmpEditingTodo, setTmpEditingTodo] = useState(todo.content ?? '')
  const [tmpEditingExecutionDate, setTmpEditingExecution] = useState(todo.executionDate ?? formatDate(new Date()))
  const toggleDone = async () => {
    const { errors } = await client.models.Todo.update({
      id: todo.id,
      isDone: !todo.isDone,
    })

    if (errors) {
      console.error(errors)
    }
  }

  const startEditContent = () => {
    setIsEditContent(true)
  }

  const editContent = async () => {
    const { errors } = await client.models.Todo.update({
      id: todo.id,
      content: tmpEditingTodo,
    })
    setIsEditContent(false)

    if (errors) {
      console.error(errors)
    }
  }

  const editExecutionDate = async () => {
    const { errors } = await client.models.Todo.update({
      id: todo.id,
      executionDate: tmpEditingExecutionDate,
    })
    setIsEditExecutionDate(false)

    if (errors) {
      console.error(errors)
    }
  }

  const startEditExecutionDate = () => {
    setIsEditExecutionDate(true)
  }

  const remove = async () => {
    const { errors } = await client.models.Todo.delete({
      id: todo.id,
    })

    if (errors) {
      console.error(errors)
    }
  }

  return (
    <>
      <button className="size-4 border" onClick={toggleDone}>
        {todo.isDone && <CheckIcon />}
      </button>
      {isEditContent && (
        <input
          value={tmpEditingTodo}
          onChange={(e) => setTmpEditingTodo(e.target.value)}
          onBlur={editContent}
        />
      )}
      {isEditExecutionDate && <input type="date" value={tmpEditingExecutionDate} onChange={e => setTmpEditingExecution(e.target.value)} onBlur={editExecutionDate} />}
      {!isEditContent && !isEditExecutionDate && (
        <>
          {todo.content}-{todo.executionDate}
          <button onClick={startEditContent}>
            <PencilSquare className="size-4" />
          </button>
          <button onClick={startEditExecutionDate}>
            <Calendar className="size-4" />
          </button>
          <button onClick={remove}>
            <Trash className="size-4" />
          </button>
        </>
      )}
    </>
  )
}
