import { Button, ButtonGroup, Grid, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import { MdDelete, MdDragIndicator } from "react-icons/md";
import { Element } from "../../../FormEditor/FormEditor";
import FormLabel from "../../components/FormLabel";
import { elements_type } from "../../constants";
import Heading from "../Heading";

interface GridLayoutProps {
  index: number;
  formElement: {
    id: string;
    fields: Array<FormField>;
    noOfColumns: number;
  };
  formData: Array<any>;
  updateFormData: (newFormData: Array<any>) => void;
  handleCollapse: (id: string) => void;
  collapse: string | null;
  handleDragStart: (e: React.DragEvent, fieldIndex: number) => any;
  onDelete: (index: number) => any;
  activeLanguage: string;
  setCollapse: React.Dispatch<React.SetStateAction<string>>;
}

interface FormField {
  id: string;
  element_type: string;
  input_type?: string;
  width?: number;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  index,
  formElement,
  formData,
  updateFormData,
  handleCollapse,
  collapse,
  handleDragStart: handleDragst,
  onDelete,
  activeLanguage,
  setCollapse,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent, fieldIndex: number) => {
    e.dataTransfer.setData("text/plain", fieldIndex.toString());
    e.dataTransfer.setData("dragged/grid", index.toString());

    setDraggedIndex(fieldIndex);
  };

  const updateFields = (newFields: FormField[]) => {
    const updatedFormElement = {
      ...formElement,
      noOfColumns: formElement.noOfColumns ?? 2,
      fields: newFields,
    };
    const updatedFormData = formData.map((form, i) =>
      i === index ? updatedFormElement : form
    );
    updateFormData(updatedFormData);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const elementType = e.dataTransfer.getData("type");
    const elementData = e.dataTransfer.getData("element");

    const elementIndex: any = e.dataTransfer.getData("element_ind");
    const elementID: any = e.dataTransfer.getData("element_id");

    if (elementID) {
      const draggedElementIndex = Number(elementIndex);
      const newData = [...formData];
      const [draggedElement] = newData.splice(draggedElementIndex, 1); // Remove dragged element
      // newData.splice(index, 0, draggedElement); // Insert dragged element at the new position

      const updatedFormElement = {
        ...formElement,
        noOfColumns: formElement.noOfColumns ?? 2,
        fields: [...formElement.fields, draggedElement],
      };
      const updatedFormData = newData.map((form, i) =>
        i === index ? updatedFormElement : form
      );
      updateFormData(updatedFormData);
    } else if (elementType) {
      // Add new element
      const newElement: FormField = elementData
        ? JSON.parse(elementData)
        : {
            element_type: elementType,
            id: `id${Date.now()}`,
            input_type: elementType === "TEXT_FIELD" ? "string" : undefined,
            width: 25,
          };

      const newFields = [...(formElement.fields || []), newElement].filter(
        (field) => field.id
      );
      console.log("New Fields after drop:", newElement);

      setCollapse(newElement.id);
      updateFields(newFields);
    } else if (dragIndex !== dropIndex) {
      // Reorder existing fields
      const newFields = [...(formElement.fields || [])];
      const [draggedItem] = newFields.splice(dragIndex, 1);
      newFields.splice(dropIndex, 0, draggedItem);
      updateFields(newFields);
    }

    setDraggedIndex(null);
  };

  const handleDelete = (id: string) => {
    const newFields = formElement.fields.filter((field) => field.id !== id);
    updateFields(newFields);
  };

  const handleColumnChange = (value: number) => {
    const updatedFormElement = { ...formElement, noOfColumns: value };
    const updatedFormData = formData.map((form, i) =>
      i === index ? updatedFormElement : form
    );
    updateFormData(updatedFormData);
  };

  function checkBorderRight(index: number) {
    return !((formElement.noOfColumns || 2) % index);
  }

  const updateGridFormData = (newFormData: Array<any>) => {
    const updatedFormData = [...formData];
    formData[index].fields = newFormData;
    updateFormData(updatedFormData);
  };

  return (
    <Grid
      container
      className="rounded-md border-2 border-dashed min-h-[150px] w-full"
      padding={1}
      onDragOver={allowDrop}
      onDrop={(e) => handleDrop(e, formElement?.fields?.length)}
      onDragEnd={() => setDraggedIndex(null)}
    >
      <Grid item xs={12} md={12} paddingX={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <div draggable onDragStart={(e) => handleDragst(e, index)}>
              <MdDragIndicator className="fill-slate-400" />
            </div>
            <FormLabel label="Grid" gutterBottom={false} />

            <ButtonGroup size="small">
              {[1, 2, 3, 4].map((value) => (
                <Button
                  key={value}
                  onClick={() => handleColumnChange(value)}
                  disableElevation
                  variant={
                    (formElement.noOfColumns || 2) === value
                      ? "contained"
                      : "outlined"
                  }
                >
                  {value}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
          <IconButton size="small" onClick={() => onDelete(index)}>
            <MdDelete />
          </IconButton>
        </Stack>
      </Grid>
      {!formElement.fields?.length && (
        <>
          {new Array(formElement.noOfColumns).fill(1).map((_, ind) => (
            <Grid
              key={ind}
              item
              md={12 / (formElement.noOfColumns || 2)}
              padding={1}
              className={
                "border-r-1" + checkBorderRight(ind)
                  ? "border-r-2 border-dashed h-150"
                  : ""
              }
            ></Grid>
          ))}{" "}
        </>
      )}
      {formElement.fields?.map((field, fieldIndex) => (
        <Grid
          item
          xs={12 / (formElement.noOfColumns || 2)}
          key={field.id}
          padding={1}
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, fieldIndex)}
          className={
            checkBorderRight(fieldIndex) ? "border-r-2 border-dashed h-300" : ""
          }
        >
          <div
            className={`rounded-md bg-white shadow-md ${
              collapse === field?.id
                ? "border-blue-500 shadow-lg shadow-blue-500/50"
                : ""
            }`}
          >
            <Heading
              type={field.element_type}
              onDelete={() => handleDelete(field.id)}
              onCollapse={() => handleCollapse(field.id)}
              handleDragStart={(e) => handleDragStart(e, fieldIndex)}
              collapse={
                ![elements_type.DATAGRID, elements_type.SEARCHDATA].includes(
                  field.element_type
                )
              }
              // handleDragStart={(e) => handleDragStart(e, fieldIndex)}
            />
            <Element
              index={fieldIndex}
              collapse={collapse}
              formElement={field}
              formData={formData[index].fields}
              // updateFormData={updateFormData}
              updateFormData={updateGridFormData}
              setFormData={() => {}}
              activeLanguage={activeLanguage}
              setShouldCallAPI={() => {}}
            />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridLayout;
