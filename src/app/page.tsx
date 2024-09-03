'use client'
import type { Schema } from '@/amplify/data/resource'
import outputs from '@/amplify_outputs.json'
import { TodoRow } from '@/src/components/TodoRow'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { useEffect, useState } from 'react'
import { Clock } from '../components/Clock'

Amplify.configure(outputs)

const client = generateClient<Schema>()

export default function Home() {
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
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <Clock />
          <h1>{user?.signInDetails?.loginId}&aposs todos</h1>
          <button onClick={createTodo}>+ new</button>
          <button onClick={signOut}>Sign out</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-2">
                <TodoRow todo={todo} />
              </li>
            ))}
          </ul>
        </main>
      )}
    </Authenticator>
  )
}
