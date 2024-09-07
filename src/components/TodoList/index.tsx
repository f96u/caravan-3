'use client'
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'
import { TodoRow } from './TodoRow'

const client = generateClient<Schema>()

export const TodoList = () => {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([])

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => setTodos([...items]),
    })
    return () => sub.unsubscribe()
  }, [])

  const createTodo = async () => {
    const { errors } = await client.models.Todo.create({
      content: window.prompt('Todo content'),
      isDone: false,
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
