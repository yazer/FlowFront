import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: any) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div className="h-full w-full" ref={setNodeRef}>
      {props.children}
    </div>
  );
}
