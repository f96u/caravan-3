import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()

const create = async <T extends keyof Schema>(model: T, contents: Schema[T]['createType']) => {
  const result = await client.models[model].create(contents)
  if (!!result.errors) {
    console.error(result.errors)
  }
  return result
}

const update = async <T extends keyof Schema>(model: T, contents: Schema[T]['updateType']) => {
  const result = await client.models[model].update(contents)
  if (!!result.errors) {
    console.error(result.errors)
  }
  return result
}

const remove = async <T extends keyof Schema>(model: T, contents: Schema[T]['deleteType']) => {
  const result = await client.models[model].delete(contents)
  if (!!result.errors) {
    console.error(result.errors)
  }
  return result
}

const observeQuery = <T extends keyof Schema>(model: T) => {
    return client.models[model].observeQuery()
}

export const amplifyClient = {
  create,
  update,
  remove,
  observeQuery,
}
