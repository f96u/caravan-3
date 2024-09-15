'use client'
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { TodoRow } from './TodoRow'
import { useTodo } from './useTodo'

const client = generateClient<Schema>()

export const TodoList = () => {
  const { todos } = useTodo()

  const createTodo = async () => {
    const { errors } = await client.models.Todo.create({
      content: window.prompt('Todo content'),
    })

    if (errors) {
      console.error(errors)
    }
  }

  return (
    <>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <TodoRow todo={todo} />
          </li>
        ))}
      </ul>
      <button onClick={createTodo}>+ new</button>
    </>
  )
}
