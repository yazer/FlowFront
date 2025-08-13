import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Element } from "../../../FormEditor/FormEditor";
import Heading from "../Heading";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { Grid } from "@mui/material";

interface FormEditorProps {
  updateFormData: (data: any, api_call?: boolean) => void;
  formData: Array<any>; // 'initialData' is passed in props
  formContainerWidth: number;
  updateParentData: any;
  parentData: any;
  currentElement: any;
  activeLanguage: string;
  index: number;
}

const subtractValueForContainer = 165;

const FormEditorGrouping = ({
  currentElement,
  updateFormData,
  formData,
  formContainerWidth,
  updateParentData,
  parentData,
  activeLanguage,
  index,
}: FormEditorProps) => {
  const [onDragOverIndex, setOnDragOverIndex] = useState<undefined | number>(
    undefined
  );
  const [collapse, setCollapse] = useState<string>("");
  const [heights, setHeights] = useState(formData.map(() => 0));

  const contentRefs = useRef<(HTMLDivElement | null)[]>(
    formData.map(() => null)
  );
  useEffect(() => {
    const observers = contentRefs.current.map((ref, index) => {
      if (ref) {
        const observer = new ResizeObserver(() => updateHeight(index));
        observer.observe(ref);
        return observer;
      }
      return null;
    });

    // Cleanup observers on unmount or changes
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [formData]);

  const updateHeight = (index: number) => {
    // Update height based on content
    const height = contentRefs.current[index]?.scrollHeight || 0;
    setHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  // Handle dropping an element into the form editor
  const drop = (index: number, ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();

    const expectType = ["TITLE", "GROUPFIELDS"];

    const data: string = ev.dataTransfer.getData("type");
    const element: any = ev.dataTransfer.getData("element");
    const elementIndex: any = ev.dataTransfer.getData("element_ind");
    const elementID: any = ev.dataTransfer.getData("element_id");
    const draggableParent: any = ev.dataTransfer.getData("draggedComponent");

    setOnDragOverIndex(undefined);

    if (draggableParent === "ElementsList" && expectType?.includes(data)) {
      return;
    }

    if (elementID) {
      if (draggableParent === "FormEditor") {
        const newElement = JSON.parse(element);
        const updatedParentList = parentData.filter(
          (item: any) => item.id !== newElement.id
        );

        const newData = [...formData, newElement];
        updateFormData(newData, true);

        updateParentData(
          updatedParentList.map((item: any) => {
            return item.id === currentElement.id
              ? { ...item, fields: [...(item?.fields ?? []), newElement] }
              : item;
          })
        );
      }
      if (draggableParent === "GroupingEditor") {
        const draggedElementIndex = Number(elementIndex);
        const newData = [...formData];
        const [draggedElement] = newData.splice(draggedElementIndex, 1);
        newData.splice(index, 0, draggedElement);

        updateFormData(newData, true);
      }
    } else {
      let uniq = "id" + new Date().getTime();
      let arrayItem = element
        ? JSON.parse(element)
        : { element_type: data, id: uniq, width: 100 };
      const newData = [
        ...formData.slice(0, index),
        arrayItem,
        ...formData.slice(index),
      ];

      updateFormData(newData, true);
    }
  };

  const handleDragStart = (ev: any, element: any, fieldIndex: number) => {
    ev.stopPropagation();
    // ev.dataTransfer.setData("element", JSON.stringify(element));
    // ev.dataTransfer.setData("element_ind", index);
    // ev.dataTransfer.setData("element_id", element.id);
    // ev.dataTransfer.setData("draggedComponent", "GroupingEditor");

    ev.dataTransfer.setData("text/plain", fieldIndex.toString());
    ev.dataTransfer.setData("dragged/grid", index.toString());
  };

  const allowDrop = (index: number, ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleRemove = (index: number) => {
    const updatedFormData = formData.filter((_, ind) => ind !== index);
    updateFormData(updatedFormData, true);
  };

  // console.log(formData)

  const handleCollapse = (id: string) => {
    if (id === collapse) {
      setCollapse("");
    } else {
      setCollapse(id);
    }
    // if(!!formData?.find((x) => x?.id === id)){
    //  setCollapse((prev) => prev.filter((item) => item?.id !== id))
    // }else {
    //   setCollapse([...collapse, id])
    // }
  };

  const handleResize = (
    event: SyntheticEvent,
    { size }: ResizeCallbackData,
    currentId: string
  ) => {
    const getNearestStepWidth = (newWidth: number) => {
      const steps = [0.25, 0.5, 0.75, 1];
      const closestStep = steps.reduce((prev, curr) =>
        Math.abs(
          curr * (formContainerWidth - subtractValueForContainer) - newWidth
        ) <
        Math.abs(
          prev * (formContainerWidth - subtractValueForContainer) - newWidth
        )
          ? curr
          : prev
      );
      return closestStep * (formContainerWidth - subtractValueForContainer);
    };

    const adjustedWidth = getNearestStepWidth(size.width);

    const updatedWidthItem = formData?.map((x) =>
      x.id === currentId
        ? {
            ...x,
            width: getWidthPercentagewithPixel(adjustedWidth), // Set the width to the adjusted value
          }
        : x
    );

    updateFormData(updatedWidthItem, true);
  };

  const getWidthPercentagewithPixel = (currentWidth: any) => {
    const width: number = formContainerWidth - subtractValueForContainer;
    const widthPercentage = (currentWidth / width) * 100;
    return widthPercentage;
  };

  const pixelValue = (percentage: number = 0) => {
    const widthPercentage = percentage ? percentage : 100;
    return (
      (widthPercentage / 100) * (formContainerWidth - subtractValueForContainer)
    );
  };

  const columnValue = (percentage: number = 0) => {
    const widthPercentage = percentage ? percentage : 100;
    return (widthPercentage / 100) * 12;
  };

  return (
    <div
      className="w-full preview-area px-4"
      style={{
        height: formData.length > 0 ? "auto" : "100%",
        minHeight: "200px",
      }}
      onDrop={(e) => {
        drop(formData.length, e);
      }}
      onDragOver={(e) => {
        allowDrop(formData.length, e);
      }}
      onDragLeave={() => setOnDragOverIndex(undefined)}
    >
      <Grid container mt={"16px"} mb={"16px"} spacing={1}>
        {formData.length > 0 ? (
          formData?.map((formElement: any, index: number) => (
            <Grid item md={columnValue(formElement?.width)}>
              <ResizableBox
                key={formElement?.id}
                width={pixelValue(formElement?.width)}
                // width={100}
                axis="x"
                resizeHandles={["e"]}
                handle={
                  <div
                    style={{
                      width: "2px",
                      cursor: "ew-resize",
                      // backgroundColor: "#007bff",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  />
                }
                height={heights[index]}
                onResize={(e, data) => {
                  e.stopPropagation();
                }}
                onResizeStop={(e, data) =>
                  handleResize(e, data, formElement?.id)
                }
                minConstraints={[300, heights[index]]}
                maxConstraints={[
                  formContainerWidth - subtractValueForContainer,
                  800,
                ]}
                style={{
                  margin: "0 0 0 0",
                }}
              >
                <div
                  key={formElement?.id || index}
                  onDragOver={(e) => allowDrop(index, e)}
                  // onDragStart={(e) => handleDragStart(e, formElement, index)}
                  onDrop={(e) => drop(index, e)}
                  // draggable
                >
                  {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4"> */}

                  <div ref={(el) => (contentRefs.current[index] = el)}>
                    {onDragOverIndex === index && (
                      <div className="mb-2 h-[1px] bg-[#8ed6ff]" />
                    )}
                    <div className="border-[1px] rounded-md bg-white shadow-md">
                      {/* Header with Collapse and Delete */}
                      <Heading
                        type={formElement?.element_type ?? ""}
                        onDelete={() => handleRemove(index)}
                        onCollapse={() => handleCollapse(formElement?.id)}
                        handleDragStart={(e: any) =>
                          handleDragStart(e, formElement, index)
                        }
                      />
                      <Element
                        collapse={collapse}
                        formElement={formElement}
                        index={index}
                        handleRemove={handleRemove}
                        formData={formData}
                        setFormData={() => {}}
                        updateFormData={() => {}}
                        updateGroupData={updateFormData}
                        setShouldCallAPI={() => {}}
                        formContainerWidth={formContainerWidth}
                        activeLanguage={activeLanguage}
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </ResizableBox>
            </Grid>
          ))
        ) : (
          <div className="flex h-full w-full font-medium text-sm text-center justify-center items-center">
            <p>Drag Elements you want to group</p>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default FormEditorGrouping;
