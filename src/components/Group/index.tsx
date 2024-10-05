'use client'

import { TodoList } from './TodoList'
import { useGroup } from './useGroup'
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()

export const Group = () => {
  const { groups, createGroup } = useGroup()

  const createTodo = async (group: Schema['Group']['type']) => {
    await client.models.Todo.create({
      groupId: group.id,
      content: window.prompt('Todo content'),
    })
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.id}>
          {group.name}
          <TodoList group={group} />
          <button onClick={() => createTodo(group)}>+ new Todo</button>
        </div>
      ))}
      <button onClick={createGroup}>+ new Group</button>
    </>
  )
}