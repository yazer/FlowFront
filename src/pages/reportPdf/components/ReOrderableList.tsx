import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import { MdDragHandle } from "react-icons/md";

// Sortable item with drag handle
export const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""}`}
    >
      <span>{children}</span>
    </div>
  );
};

export function SortableHandle({
  children,
  id,
}: {
  children: React.ReactElement;
  id: string;
}) {
  const { attributes, listeners, setActivatorNodeRef } = useSortable({ id });
  return React.cloneElement(children, {
    ref: setActivatorNodeRef,
    ...attributes,
    ...listeners,
  });
}

export default function SortableListWithHandles() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div
          className="w-64 mx-auto mt-4"
          style={{
            backgroundImage: `
      linear-gradient(to right, #eee 1px, transparent 1px),
      linear-gradient(to bottom, #eee 1px, transparent 1px)
    `,
            backgroundSize: "20px 20px", // Adjust grid spacing here
          }}
        >
          {items.map((id) => (
            <SortableItem key={id} id={id}>
              {id}
              <SortableHandle id={id}>
                <MdDragHandle />
              </SortableHandle>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
