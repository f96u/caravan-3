import type { Schema } from '@/amplify/data/resource'
import { amplifyClient } from '@/src/lib/amplifyClient'
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { TodoRow } from './TodoRow'

type Props = {
  group: Schema['Group']['type']
}

export const TodoList = ({ group }: Props) => {
  const [orderList, setOrderList] = useState<UniqueIdentifier[]>([])
  const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    ;(async () => {
      setTodos((await group.members()).data)
    })()
  }, [group])

  useEffect(() => {
    // NOTE: Todoを作成した直後の場合、Groupモデルのorderにid登録がないため新規作成順でリスト末尾に加える
    const unsortedTodos = todos
      .filter((t) => !group.order.includes(t.id))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((t) => t.id)
    const groupOrder = group.order.map((o) => `${o}`)
    setOrderList([...groupOrder, ...unsortedTodos])
  }, [group.order, todos])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over !== null && active.id !== over.id) {
      const nextOrderList = arrayMove(
        orderList,
        orderList.indexOf(active.id),
        orderList.indexOf(over.id),
      )
      setOrderList(nextOrderList)
      await amplifyClient.update('Group', {
        id: group.id,
        order: nextOrderList.map((o) => `${o}`),
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderList} strategy={verticalListSortingStrategy}>
        {orderList.map((id) => {
          const todo = todos.find((todo) => todo.id === id)
          return todo && <TodoRow key={todo.id} todo={todo} />
        })}
      </SortableContext>
    </DndContext>
  )
}
