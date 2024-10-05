import type { Schema } from '@/amplify/data/resource'
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
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react'
import { TodoRow } from '../TodoRow'

const client = generateClient<Schema>()

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
      await client.models.Group.update({
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
          return (
            todo && (
              <div key={todo.id} className="flex items-center gap-2">
                <TodoRow todo={todo} />
              </div>
            )
          )
        })}
      </SortableContext>
    </DndContext>
  )
}
