import type { Schema } from '@/amplify/data/resource'
import { CheckIcon } from '@/src/svgs/CheckIcon'
import { PencilSquare } from '@/src/svgs/PencilSquare'
import { Trash } from '@/src/svgs/Trash'
import { generateClient } from 'aws-amplify/api'
import { useState } from 'react'

const client = generateClient<Schema>()

type Props = {
  todo: Schema['Todo']['type']
}
export const TodoRow = ({ todo }: Props) => {
  const [isEdit, setIsEdit] = useState(false)
  const [tmpEditingTodo, setTmpEditingTodo] = useState(todo.content ?? '')
  const toggleDone = async () => {
    const { errors } = await client.models.Todo.update({
      id: todo.id,
      isDone: !todo.isDone,
    })

    if (errors) {
      console.error(errors)
    }
  }

  const startEdit = () => {
    setIsEdit(true)
  }

  const editTodo = async () => {
    const { errors } = await client.models.Todo.update({
      id: todo.id,
      content: tmpEditingTodo,
    })
    setIsEdit(false)

    if (errors) {
      console.error(errors)
    }
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
      {isEdit ? (
        <input
          value={tmpEditingTodo}
          onChange={(e) => setTmpEditingTodo(e.target.value)}
          onBlur={editTodo}
        />
      ) : (
        <>
          {todo.content}
          <button onClick={startEdit}>
            <PencilSquare className="size-4" />
          </button>
          <button onClick={remove}>
            <Trash className="size-4" />
          </button>
        </>
      )}
    </>
  )
}
