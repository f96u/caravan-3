'use client'
import Image from "next/image";
import { generateClient } from "aws-amplify/data"
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify"
import type { Schema } from '@/amplify/data/resource'
import outputs from "@/amplify_outputs.json"
import { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs)

const client = generateClient<Schema>()

export default function Home() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([])

  const listTodos = () => {
    client.models.Todo.observeQuery().subscribe({
      next: data => setTodos([...data.items])
    })
  }

  useEffect(() => {
    listTodos()
  }, [])

  const createTodo = () => {
    client.models.Todo.create({
      content: window.prompt("Todo content")
    })
  }

  const deleteTodo = (id: string) => {
    client.models.Todo.delete({ id })
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}&aposs todos</h1>
          <button onClick={createTodo}>+ new</button>
          <button onClick={signOut}>Sign out</button>
          <ul>
            {todos.map(todo => (
              <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                {todo.content}
              </li>
            ))}
          </ul>
        </main>
      )}
    </Authenticator>
  );
}
