import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function Draggable(props: any) {
  const { id, children, data, className } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data || {},
  });
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={className}
    >
      {children}
    </button>
  );
}
export { Draggable };
