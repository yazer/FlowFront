/* eslint-disable react-hooks/exhaustive-deps */
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRef, useState } from "react";
import DialogCustomized from "../../components/Dialog/DialogCustomized";
import { elements_type } from "../../components/FormElements/constants";
import { SortableItem } from "./components/ReOrderableList";
import ReportGenHeader from "./ReportGenHeader";
import Section from "./Section";
import SideBar from "./SideBar";
import { JspreadsheetConfig } from "./types";

export const CONTAINER_WIDTH = 800;
export const CONTAINER_HEIGHT = 200;

type Position = { x: number; y: number };

type ElementsType = (typeof elements_type)[keyof typeof elements_type];

export type ButtonItem = {
  id: string;
  label?: string;
  translate?: { [key: string]: { label: string; placeholder?: string } };
  position: Position;
  size: { width: number; height: number };
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    textDecoration?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    lineThrough?: boolean;
    fontFamily?: string;
  };
  tableConfig?: JspreadsheetConfig; // Only needed if type is "custom_table"
  element_type?: ElementsType;
  index?: number;
  items?: ButtonItem[];
  type?: "textfield" | "button" | "image" | "heading" | "custom_table"; // Added "custom_table"
  value?: string; // For text fields
  imgSrc?: string; // For images
};

const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = 40;

// const isOverlapping = (
//   posA: Position,
//   posB: Position,
//   sizeA: { width: number; height: number },
//   sizeB: { width: number; height: number }
// ): boolean => {
//   return !(
//     posA.x + sizeA.width <= posB.x ||
//     posB.x + sizeB.width <= posA.x ||
//     posA.y + sizeA.height <= posB.y ||
//     posB.y + sizeB.height <= posA.y
//   );
// };

export default function FreeMoveContainer({
  formFields,
  sections,
  setSections,
  isPrint = false,
  preview,
}: {
  formFields: any[];
  sections: ButtonItem[];
  setSections: React.Dispatch<React.SetStateAction<ButtonItem[]>>;
  isPrint?: boolean;
  preview?: boolean;
}) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // ← Wait until user moves 5px before activating drag
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const index = sections.findIndex((s) => s.id === over?.id);

    debugger;
    if (active.id !== over?.id && over?.id && active.data.current?.sortable) {
      setSections((prevSections) => {
        const sections = [...prevSections];
        const oldIndex = sections.findIndex((s) => s.id === active.id);
        const newIndex = sections.findIndex((s) => s.id === over.id);

        const finalArr = moveItem(sections, oldIndex, newIndex);
        console.log(finalArr);

        return finalArr;
      });
      return;
    }

    function moveItem(array: any[], oldIndex: number, newIndex: number) {
      if (
        oldIndex < 0 ||
        oldIndex >= array.length ||
        newIndex < 0 ||
        newIndex >= array.length
      ) {
        console.error("Invalid indices");
        return array;
      }

      const item = { ...array.splice(oldIndex, 1)[0] }; // Remove item from oldIndex
      array.splice(newIndex, 0, item); // Insert it at newIndex
      return array;
    }

    if (!targetRef.current) return;

    const containerRect = targetRef.current.getBoundingClientRect();

    const clientX = (event.activatorEvent as MouseEvent).clientX;
    const clientY = (event.activatorEvent as MouseEvent).clientY;

    // Calculate relative to container
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;

    console.log(x, y, "x and y");

    if (
      !over?.id ||
      (active.data.current?.new && active.data.current?.type === "table")
    ) {
      return;
    }
    // If it's a new item from sidebar
    if (active.data.current?.new) {
      const newItem: ButtonItem = {
        ...active.data.current,
        position: { x: 50, y: 100 },
        id: active.id + Math.random().toString(36).substring(2, 9),
        size: { width: BUTTON_WIDTH, height: BUTTON_HEIGHT },
      };

      setSections((prev) => {
        const section = [...prev];

        section[index].items?.push(newItem);
        return section;
      });
      return;
    }

    // Move existing item (optional: keep your old delta logic here)
    if (!active.data.current?.new) {
      setSections((prev: any[]) => {
        const sectionIndex = prev[index || 0];
        const moving = sectionIndex?.items.find(
          (btn: any) => btn.id === active.id
        );
        if (!moving) return prev;

        const newPos = {
          x: Math.min(
            CONTAINER_WIDTH - moving.size?.width,
            moving.position.x + event.delta.x
          ),
          y: Math.min(
            (prev[index || 0].size?.height || CONTAINER_HEIGHT) -
              moving.size?.height,
            moving.position.y + event.delta.y
          ),
        };

        const section = [...prev];

        section[index || 0] = {
          ...sectionIndex,
          items: sectionIndex.items.map((btn: any) =>
            btn.id === moving.id ? { ...btn, position: newPos } : btn
          ),
        };

        console.log("section switched", section);

        return section;
      });
    }
  };

  return (
    <>
      {!isPrint && isPreview && (
        <DialogCustomized
          open={isPreview}
          handleClose={() => setIsPreview(false)}
          maxWidth="lg"
          content={
            <FreeMoveContainer
              formFields={formFields}
              sections={sections}
              setSections={setSections}
              isPrint
              preview={isPreview}
            />
          }
          title={"Preview Report"}
        />
      )}

      <ReportGenHeader
        sections={sections}
        setSections={setSections}
        isPrint={isPrint}
        setIsPreview={setIsPreview}
        pdfRef={targetRef}
        selectedItem={selectedItem}
        selectedSection={selectedSection}
      />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={`flex w-full justify-center`}>
          <div
            className={`flex-1 flex-row overflow-auto justify-center items-start ${
              !isPrint ? "gap-3" : ""
            }
            ${isPrint ? `shadow-xl` : ""}`}
            ref={targetRef}
            style={{
              maxWidth: isPrint ? `${CONTAINER_WIDTH + 5}px` : "none",
            }}
          >
            {!isPrint ? <br /> : null}

            <div
              className={`flex items-center justify-center flex-col gap-3 ${
                isPrint ? "h-full" : "overflow-auto"
              }`}
              style={!isPrint ? { height: "calc(100vh - 300px)" } : undefined}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section: any, index: number) => (
                  <SortableItem key={section.id} id={section.id}>
                    <Section
                      section={section}
                      sections={sections}
                      index={index}
                      isPrint={isPrint}
                      setSections={setSections}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      selectedSection={selectedSection}
                      setSelectedSection={setSelectedSection}
                      formFields={formFields}
                      isPreview={preview}
                    />
                  </SortableItem>
                ))}

                <br />
                <br />
              </SortableContext>
            </div>
          </div>
          {!isPrint && (
            <SideBar
              formFields={formFields}
              setSections={setSections}
              setSelectedSection={setSelectedSection}
            />
          )}
        </div>
      </DndContext>
    </>
  );
}
