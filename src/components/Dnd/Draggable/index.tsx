import { useDraggable } from "@dnd-kit/core"
import type { ReactNode } from "react"
import { CSS } from '@dnd-kit/utilities'

type Props = {
  id: string
  children: ReactNode
}

export function Draggable(props: Props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}