import React from "react";
import DataGrid from "../../components/FormElements/components/DataGrid";
import ResizableBox from "./components/ResizableBox";
import DraggableItem from "./DraggableItem";
import { Droppable } from "./Droppable";
import {
  ButtonItem,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from "./FreeMoveContainer";
import SelectableWrapper from "./components/SelectableWrapper";
import { SortableHandle } from "./components/ReOrderableList";
import { MdDelete, MdDragIndicator } from "react-icons/md";
import { IconButton } from "@mui/material";
import Jspreadsheet from "./JSpreadsheetTable";

function Section({
  section,
  sections,
  // index,
  isPrint,
  setSections,
  selectedItem,
  setSelectedItem,
  selectedSection,
  setSelectedSection,
  formFields,
  isPreview,
}: {
  section: ButtonItem & any;
  sections: ButtonItem[];
  index: number;
  isPrint: boolean;
  selectedItem: string | null;
  setSections: React.Dispatch<React.SetStateAction<ButtonItem[]>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSection?: string | null;
  setSelectedSection?: React.Dispatch<React.SetStateAction<string | null>>;
  formFields?: any[];
  isPreview?: boolean;
}) {
  const index = sections.findIndex((s) => s.id === section.id);

  function handleDeleteSection() {
    setSections((prevSections) => prevSections.filter((_, i) => i !== index));
  }

  function handleChangeSection({
    key,
    value,
  }: {
    key: keyof ButtonItem;
    value: any;
  }) {
    setSections((prevSections) => {
      const sectionCopy = [...prevSections];
      const index = sectionCopy.findIndex((s) => s.id === section.id);

      // @ts-ignore
      sectionCopy[index][key] = value;
      return sectionCopy;
    });
  }

  // const index = sections.findIndex((s) => s.id === s);
  const selectedItemFull = section.items?.find(
    (item: any) => item.id === selectedItem
  );

  return (
    <>
      {!isPrint ? (
        <div className="flex items-center justify-end p-2 bg-gray-100">
          <>
            <IconButton size="small">
              <SortableHandle id={section.id}>
                <MdDragIndicator />
              </SortableHandle>
            </IconButton>

            <IconButton size="small" onClick={() => handleDeleteSection()}>
              <MdDelete />
            </IconButton>
          </>
        </div>
      ) : null}
      {(() => {
        switch (section.type) {
          case "section":
            return (
              <div className="relative flex flex-col items-center w-full">
                <GridLines
                  boxes={section.items}
                  draggingBox={selectedItemFull}
                />

                <SelectableWrapper
                  onSelect={() => setSelectedSection?.(section.id)}
                  selected={selectedSection === section.id}
                  onDeselect={() => setSelectedSection?.(null)}
                >
                  <ResizableBox
                    minWidth={CONTAINER_WIDTH}
                    maxWidth={CONTAINER_WIDTH}
                    direction="vertical"
                    width={section.size?.width || CONTAINER_WIDTH}
                    height={section.size?.height || CONTAINER_HEIGHT}
                    onResize={(size) => {
                      handleChangeSection({ key: "size", value: size });
                    }}
                  >
                    <div
                      style={{
                        ...section.style,
                        width: CONTAINER_WIDTH,
                        margin: "0 auto",
                        position: "relative",
                      }}
                      className="bg-white h-full w-full"
                    >
                      <Droppable
                        id={section.id}
                        style={{
                          width: CONTAINER_WIDTH,
                          height: CONTAINER_HEIGHT,
                        }}
                      >
                        <DraggableItem
                          index={index}
                          buttons={section?.items || section}
                          selectedItem={selectedItem}
                          setSelectedItem={setSelectedItem}
                          isPrint={isPrint}
                        />
                      </Droppable>
                    </div>
                  </ResizableBox>
                </SelectableWrapper>
              </div>
            );
          case "datagrid":
            return (
              <div
                className={`p-2 ${
                  !isPrint ? "h-[400px]" : "h-auto"
                } overflow-auto bg-white w-[800px]`}
                key={section.id}
              >
                <DataGrid field={section} search={false} />
              </div>
            );
          case "custom_table":
            return (
              <React.Fragment key={section.id}>
                <Jspreadsheet
                  config={section.tableConfig}
                  handleConfigUpdate={(config) => {
                    handleChangeSection({ key: "tableConfig", value: config });
                  }}
                  isPrint={!isPrint}
                  formFields={formFields}
                  isPreview={isPreview}
                />
              </React.Fragment>
            );
          default:
            return <>Not configured</>;
        }
      })()}
    </>
  );
}

export default Section;

const GridLines = ({ boxes, draggingBox }: any) => {
  if (!draggingBox) return null;

  const lines: any = [];
  const threshold = 10;

  for (let other of boxes) {
    if (other.id === draggingBox.id) continue;

    const dx = Math.abs(draggingBox.position.x - other.position.x);
    const dy = Math.abs(draggingBox.position.y - other.position.y);

    // Vertical alignment guide (X axis)
    if (dx <= threshold) {
      lines.push(
        <div
          key={`v-${other.id}`}
          style={{
            position: "absolute",
            left: other.position.x + 1,
            top: 0,
            height: "100%",
            width: "1px",
            background: "red",
            zIndex: 999,
          }}
        />
      );
    }

    // Horizontal alignment guide (Y axis)
    if (dy <= threshold) {
      lines.push(
        <div
          key={`h-${other.id}`}
          style={{
            position: "absolute",
            top: other.position.y + 1,
            left: 0,
            width: "100%",
            height: "1px",
            background: "red",
            zIndex: 999,
          }}
        />
      );
    }
  }

  return <>{lines}</>;
};
