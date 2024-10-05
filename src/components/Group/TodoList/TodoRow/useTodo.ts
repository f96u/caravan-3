import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()

export const useTodo = () => {
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
  return { update, remove }
}
