'use client'

import type { Schema } from '@/amplify/data/resource'
import { amplifyClient } from '@/src/lib/amplifyClient'
import { TodoList } from './TodoList'
import { useGroup } from './useGroup'

export const Group = () => {
  const { groups, createGroup } = useGroup()

  const createTodo = async (group: Schema['Group']['type']) => {
    await amplifyClient.create('Todo', {
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
      <button data-testid="create-group" onClick={createGroup}>
        + new Group
      </button>
    </>
  )
}
