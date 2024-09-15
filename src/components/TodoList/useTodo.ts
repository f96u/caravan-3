import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'

const client = generateClient<Schema>()

export const useTodo = () => {
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([])

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => setTodos([...items]),
    })
    return () => sub.unsubscribe()
  }, [])

  const update = async (
    models: Pick<
      Schema['Todo']['type'],
      'id' | 'content' | 'isDone' | 'executionDate'
    >,
  ) => {
    const { errors } = await client.models.Todo.update({
      id: models.id,
      content: models.content,
      isDone: models.isDone,
    })

    if (errors) {
      console.error(errors)
    }
  }

  const remove = async (id: string) => {
    const { errors } = await client.models.Todo.update({
      id,
    })

    if (errors) {
      console.error(errors)
    }
  }
  return { todos, update, remove }
}
