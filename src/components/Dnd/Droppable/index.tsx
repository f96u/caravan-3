import type { ReactNode } from 'react';
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

type Props = {
  id: string
  children: ReactNode
}

export function Droppable(props: Props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}