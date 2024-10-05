import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'

const client = generateClient<Schema>()
export const useGroup = () => {
  const [groups, setGroups] = useState<Array<Schema['Group']['type']>>([])

  useEffect(() => {
    const sub = client.models.Group.observeQuery().subscribe({
      next: ({ items }) => {
        setGroups([...items])
      },
    })
    return () => sub.unsubscribe()
  }, [])

  const createGroup = async () => {
    await client.models.Group.create({
      name: window.prompt('Group name'),
      order: [],
    })
  }

  return { groups, createGroup }
}
