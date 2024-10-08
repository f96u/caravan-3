import type { Schema } from '@/amplify/data/resource'
import { amplifyClient } from '@/src/lib/amplifyClient'
import { useEffect, useState } from 'react'

export const useGroup = () => {
  const [groups, setGroups] = useState<Array<Schema['Group']['type']>>([])

  useEffect(() => {
    const sub = amplifyClient.observeQuery('Group').subscribe({
      next: ({ items }) => {
        setGroups([...items])
      },
    })
    return () => sub.unsubscribe()
  }, [])

  const createGroup = async () => {
    await amplifyClient.create('Group', {
      name: window.prompt('Group name'),
      order: [],
    })
  }

  return { groups, createGroup }
}
