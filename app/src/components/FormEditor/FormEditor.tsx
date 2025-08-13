/* eslint-disable react-hooks/exhaustive-deps */
import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import FormCheckBox from "../FormElements/newcompnents/CheckBox";

import { CircularProgress, Grid, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { ResizeCallbackData } from "react-resizable";
import { createForm } from "../../apis/flowBuilder"; // Assuming createForm is used for both creating and deleting
import DateTimeInput from "../FormElements/DataTime";
import DateInput from "../FormElements/Date";
import FileInput from "../FormElements/FileInput";
import Location from "../FormElements/Location";
import MultiFileInput from "../FormElements/MultiFileInput";
import MultiSelectDropdown from "../FormElements/MultiSelectDropdown";
import Toggle from "../FormElements/Toggle";
import { elements_type } from "../FormElements/constants";
import DataGrid from "../FormElements/newcompnents/DataGrid";
import DigitalSignature from "../FormElements/newcompnents/DigitalSignature";
import DropDown from "../FormElements/newcompnents/DropDown";
import GridLayout from "../FormElements/newcompnents/GridLayout/GridLayout";
import GroupFields from "../FormElements/newcompnents/GroupFields/GroupFields";
import Heading from "../FormElements/newcompnents/Heading";
import MultiLineTextArea from "../FormElements/newcompnents/MultiLineTextArea";
import Radio from "../FormElements/newcompnents/Radio";
import SearchData from "../FormElements/newcompnents/SearchData";
import TextField from "../FormElements/newcompnents/TextField";
import Title from "../FormElements/newcompnents/Title";
import UploadDataInput from "../FormElements/UploadDataInput";

const subtractValueForContainer = 130;
interface FormEditorProps {
  updateFormData: (data: any) => void;
  initialData: any; // 'initialData' is passed in props
  selectedNodeId: string; // Add selectedNodeId prop to identify the form node
  shouldCallAPI?: boolean;
  formContainerWidth: number;
  loader?: boolean;
  activeLanguage: string;
}

const FormEditor = ({
  updateFormData,
  initialData,
  selectedNodeId,
  formContainerWidth,
  loader,
  activeLanguage,
}: FormEditorProps) => {
  const [formData, setFormData] = useState<Array<any>>([]);
  const [onDragOverIndex, setOnDragOverIndex] = useState<undefined | number>(
    undefined
  );

  const [shouldCallAPI, setShouldCallAPI] = useState(true);
  const [collapse, setCollapse] = useState<string>("");
  const [elementId, setElementId] = useState<string | null>(null);

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
    // const height = contentRefs.current[index]?.scrollHeight || 0;
    // setHeights((prevHeights) => {
    //   const newHeights = [...prevHeights];
    //   newHeights[index] = height;
    //   return newHeights;
    // });
  };

  function calculateRemainingSpace(data: any, totalWidth = 100) {
    const usedWidth = data.reduce(
      (acc: any, item: any) => acc + item?.width,
      0
    );

    // Calculate remaining space by using modulus
    const remainingSpace = totalWidth - (usedWidth % totalWidth);

    return remainingSpace % totalWidth; // Ensure result is within bounds
  }

  // Handle dropping an element into the form editor
  const drop = (index: number, ev: any) => {
    ev.stopPropagation();
    ev.preventDefault();

    // Adding new element from the toolbox
    const data: string = ev.dataTransfer.getData("type");
    const element: any = ev.dataTransfer.getData("element");

    // For rearranging the element in the grid layout
    const elementIndex: any = ev.dataTransfer.getData("element_ind");
    const elementID: any = ev.dataTransfer.getData("element_id");
    const draggableParent: any = ev.dataTransfer.getData("draggedComponent");

    // Dragged element from the grid layout
    const dataa = ev.dataTransfer.getData("text/plain");
    const draggedElementIndex = ev.dataTransfer.getData("dragged/grid");

    if (draggableParent === "GroupingEditor") {
      return;
    }
    setOnDragOverIndex(undefined);
    if (!!dataa && draggedElementIndex) {
      let newData = [...formData];
      const removedElement = newData[draggedElementIndex]?.fields.splice(
        dataa,
        1
      ); // Remove dragged element from its original position

      if (index === 0) {
        newData = [removedElement[0], ...newData]; // Insert dragged element at the new position
      } else {
        newData.splice(index, 0, removedElement[0]); // Insert dragged element at the new position
      }
      updateFormData(newData);
    } else if (elementID) {
      const draggedElementIndex = Number(elementIndex);
      const newData = [...formData];
      const [draggedElement] = newData.splice(draggedElementIndex, 1); // Remove dragged element
      newData.splice(index, 0, draggedElement); // Insert dragged element at the new position

      setFormData(newData);
      updateFormData(newData);

      if (shouldCallAPI) {
        createForm(selectedNodeId, newData)
          .then(() => console.log("Form data successfully rearranged."))
          .catch((error) =>
            console.error("Error rearranging form data:", error)
          );
      }
    } else {
      let uniq = "id" + new Date().getTime();
      let arrayItem = element
        ? JSON.parse(element)
        : {
            element_type: data,
            id: uniq,
            input_type: data === "TEXT_FIELD" ? "string" : undefined,
            width: calculateRemainingSpace(formData),
          };

      let newData = [
        ...formDataa.slice(0, index),
        arrayItem,
        ...formDataa.slice(index),
      ];
      newData = newData.filter((dat) => dat.id);

      setFormData(newData);
      updateFormData(newData);
      setCollapse(uniq);

      if (shouldCallAPI) {
        createForm(selectedNodeId, newData)
          .then(() =>
            console.log("Form data successfully updated with new element.")
          )
          .catch((error) => console.error("Error updating form data:", error));
      }
    }
  };

  const handleDragStart = (ev: any, element: any, index: number) => {
    ev.stopPropagation();
    ev.dataTransfer.setData("element", JSON.stringify(element));
    ev.dataTransfer.setData("element_ind", index);
    ev.dataTransfer.setData("element_id", element.id);
    ev.dataTransfer.setData("draggedComponent", "FormEditor");
  };

  const allowDrop = (index: number, ev: any) => {
    setOnDragOverIndex(index);
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleRemove = (index: number) => {
    const updatedFormData = formDataa.filter(
      (dat, ind) => !dat.id || ind !== index
    );
    setFormData(updatedFormData);
    updateFormData(updatedFormData);

    createForm(selectedNodeId, updatedFormData)
      .then(() => console.log("Form field successfully deleted."))
      .catch((error) => console.error("Error deleting form field:", error));
  };

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setFormData(initialData);
      updateFormData(initialData);
      if (shouldCallAPI) {
        createForm(selectedNodeId, initialData);
      }
    }
  }, [initialData]);

  const handleCollapse = (id: string) => {
    if (id === collapse) {
      setCollapse("");
    } else {
      setCollapse(id);
    }
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
      x?.id === currentId
        ? {
            ...x,
            width: getWidthPercentagewithPixel(adjustedWidth), // Set the width to the adjusted value
          }
        : x
    );

    setFormData(updatedWidthItem);
    updateFormData(updatedWidthItem);
  };

  const getWidthPercentagewithPixel = (currentWidth: any) => {
    const width: number = formContainerWidth - subtractValueForContainer;
    const widthPercentage = (currentWidth / width) * 100;
    return widthPercentage;
  };

  function normalizeWidths(widths: any) {
    let result = [];
    let currentSum = 0;

    for (const element of widths) {
      // Treat 0, null, NaN, or undefined as 100
      const width =
        element?.width == null || isNaN(element?.width) || element?.width === 0
          ? 100
          : element?.width;

      if (width === 100) {
        if (currentSum > 0) {
          // Add an empty element to make the previous group sum to 100
          result.push({ width: 100 - currentSum });
          currentSum = 0;
        }
        result.push({ ...element, width }); // Push element with normalized width
      } else {
        currentSum += width;
        result.push({ ...element, width });

        if (currentSum === 100) {
          currentSum = 0; // Reset for a new group
        }
      }
    }

    // If there's remaining width needed for the last group
    if (currentSum > 0) {
      result.push({ width: 100 - currentSum });
    }

    return result;
  }

  const formDataa = useMemo(() => {
    const test = normalizeWidths(formData);
    return test;
  }, [formData]);

  return (
    <>
      <div
        className="w-full preview-area px-3 form-builder-editor"
        style={{
          height: formData.length > 0 ? "auto" : "100%",
          minHeight: "calc(100vh - 200px)",
        }}
        onDrop={(e) => {
          drop(formData.length, e);
        }}
        onDragOver={(e) => {
          allowDrop(formData.length, e);
        }}
        onDragLeave={() => setOnDragOverIndex(undefined)}
      >
        {loader ? (
          <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
            <CircularProgress />
          </div>
        ) : (
          <Grid container mt={"4px"} mb={"12px"} width="100%" spacing={1}>
            {formDataa?.map((formElement, index: number) => {
              if (formElement.element_type === elements_type.GRID) {
                return (
                  <div className="h-full w-full p-2" key={formElement.id}>
                    <GridLayout
                      index={index}
                      formElement={formElement}
                      formData={formData}
                      updateFormData={(data) => {
                        setFormData(data);
                        updateFormData(data);
                      }}
                      handleCollapse={handleCollapse}
                      collapse={collapse}
                      handleDragStart={(e: any) =>
                        handleDragStart(e, formElement, index)
                      }
                      onDelete={() => handleRemove(index)}
                      activeLanguage={activeLanguage}
                      setCollapse={setCollapse}
                    />
                  </div>
                );
              }
              return (
                <Grid item md={12}>
                  <div
                    id={formElement?.id}
                    onDragOver={(e) => allowDrop(index, e)}
                    onDragStart={(e) => handleDragStart(e, formElement, index)}
                    onDrop={(e) => drop(index, e)}
                    onDragEnd={() => setOnDragOverIndex(undefined)}
                  >
                    <div ref={(el) => (contentRefs.current[index] = el)}>
                      {onDragOverIndex === index && (
                        // <div className="mb-2 min-h-[50px] bg-[#8ed6ff]" />
                        <div className="mb-2 min-h-[50px] bg-[#96adc542] rounded-md flex items-center justify-center">
                          <Typography variant="h5">
                            <FormattedMessage id="formBuilderElementDrop" />
                          </Typography>
                        </div>
                      )}
                      {formElement.id && (
                        <div
                          onClick={() => {
                            setElementId(formElement.id);
                          }}
                          className={`border-[1px] min-h-[100px] rounded-md bg-white shadow-md ${
                            collapse === formElement?.id ||
                            elementId === formElement.id
                              ? "border-blue-500 shadow-lg shadow-blue-500/50"
                              : ""
                          }`}
                        >
                          {/* Header with Collapse and Delete */}
                          <Heading
                            type={formElement?.element_type ?? ""}
                            onDelete={() => handleRemove(index)}
                            onCollapse={() => handleCollapse(formElement?.id)}
                            handleDragStart={(e) =>
                              handleDragStart(e, formElement, index)
                            }
                          />
                          <Element
                            collapse={collapse}
                            formElement={formElement}
                            index={index}
                            handleRemove={handleRemove}
                            formData={formData}
                            setFormData={setFormData}
                            updateFormData={updateFormData}
                            selectedNodeId={selectedNodeId}
                            setShouldCallAPI={setShouldCallAPI}
                            formContainerWidth={formContainerWidth}
                            activeLanguage={activeLanguage}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        )}
        {onDragOverIndex && onDragOverIndex >= formDataa.length && (
          <div className="mb-2 min-h-[50px] bg-[#96adc542] rounded-md flex items-center justify-center">
            <Typography variant="h5">
              <FormattedMessage id="formBuilderElementDrop"></FormattedMessage>
            </Typography>
          </div>
        )}
        <br />
      </div>
    </>
  );
};

export default FormEditor;

export function Element({
  collapse,
  formElement,
  index,
  handleRemove,
  formData,
  setFormData,
  updateFormData,
  setShouldCallAPI,
  updateGroupData = () => {},
  formContainerWidth = 800,
  activeLanguage,
}: any) {
  const commonProps = {
    formElement,
    elements_type: formElement?.element_type,
    collapse,
    en: formElement?.en,
    ar: formElement?.ar,
    activeLanguage,
    onDelete: () => handleRemove(index),
    onChange: (data: any, api_call = true) => {
      setShouldCallAPI(api_call);
      const updatedFormData = JSON.parse(JSON.stringify(formData));
      updatedFormData[index] = data;
      updateGroupData(updatedFormData, api_call);
      setFormData(updatedFormData);

      updateFormData(updatedFormData);
    },
    label: formElement?.label,
    formData: formData,
  };

  const updateParentData = (data: any) => {
    setShouldCallAPI(true);
    setFormData(data);
    updateFormData(data, true);
  };

  switch (formElement?.element_type) {
    case elements_type.TITLE:
      return <Title {...commonProps} />;
    case elements_type.TEXTFIELD:
      return (
        <TextField
          name={formElement.name}
          validation={formElement}
          {...commonProps}
        />
      );
    case elements_type.CHECKBOX:
      return (
        <FormCheckBox
          {...commonProps}
          name={formElement.name}
          required={formElement.required}
          readonly={formElement.readonly}
          hidden={formElement.hidden}
        />
      );
    case elements_type.DROPDOWN:
      return <DropDown {...commonProps} />;
    case elements_type.MULTISELECTDROPDOWN:
      return <MultiSelectDropdown {...commonProps} />;
    case elements_type.UPLOAD_DATA_DYN:
      return <UploadDataInput {...commonProps} />;
    case elements_type.FILEUPLOAD:
      return <FileInput {...commonProps} />;
    case elements_type.CONVERT_IMAGE:
      return <FileInput {...commonProps} />;
    case elements_type.RADIOBUTTON:
      return <Radio {...commonProps} options={formElement.options} />;
    case elements_type.MULTIFILEUPLOAD:
      return <MultiFileInput {...commonProps} />; // Update this to call handleRemove
    case elements_type.DATE:
      return <DateInput {...commonProps} />;
    case elements_type.DATE_TIME:
      return <DateTimeInput {...commonProps} />;
    case elements_type.TOGGLE:
      return <Toggle {...commonProps} />;
    case elements_type.GROUPFIELDS:
      return (
        <GroupFields
          {...commonProps}
          index={index}
          formContainerWidth={formContainerWidth}
          parentData={formData}
          updateParentData={updateParentData}
          activeLanguage={activeLanguage}
        />
      );
    case elements_type.DIGITASIGNATURE:
      return <DigitalSignature {...commonProps} />;
    case elements_type.LOCATION:
      return <Location {...commonProps} />;
    case elements_type.DATAGRID:
      return <DataGrid {...commonProps} />;
    case elements_type.SEARCHDATA:
      return <SearchData {...commonProps} />;
    case elements_type.GRID:
      return <></>;
    case elements_type.MULTILINETEXTFIELD:
      return <MultiLineTextArea {...commonProps} />;
    default:
      return <>Not implemented</>;
  }
}
