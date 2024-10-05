import type { Schema } from '@/amplify/data/resource'
import { useState, useEffect } from 'react'
import { TodoRow } from '../TodoRow'
import type { DragEndEvent, UniqueIdentifier} from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

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
    })
  )

  useEffect(() => {
    (async () => {
      setTodos((await group.members()).data)
    })()

    // NOTE: Todoを作成した直後の場合、Groupモデルのorderにid登録がないため新規作成順でリスト末尾に加える
    const unsortedTodos =
      todos
        .filter(t => !group.order.includes(t.id))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(t => t.id)
    const groupOrder = group.order.map(o => `${o}`)
    setOrderList([...groupOrder, ...unsortedTodos])
  }, [group, todos])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over !== null && active.id !== over.id) {
      setOrderList(items => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderList}
        strategy={verticalListSortingStrategy}
      >
        {orderList.map(id => {
          const todo = todos.find(todo => todo.id === id)
          return todo && (
            <div key={todo.id} className="flex items-center gap-2">
              <TodoRow todo={todo} />
            </div>
          )
        })}
        </SortableContext>
    </DndContext>
  )
}