import React, { FC, useState } from "react";
import Heading from "./components/Heading";
import InputField from "./components/InputField";
import { elements_type } from "./constants";

interface TextFieldInterface {
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  label?: string;
  placeHolder?: string;
  selectedNodeId: string; // Added selectedNodeId prop
}

const TextField: FC<TextFieldInterface> = ({
  onDelete,
  onChange,
  label,
  placeHolder,
  selectedNodeId, // Using selectedNodeId prop
}) => {
  const [data, setData] = useState({
    label: label || "",
    placeholder: placeHolder || "",
    element_type: "INP",
    input_type: elements_type.TEXTFIELD,
  });

  return (
    <div className="border-[1px] rounded-md bg-white">
      <Heading type={elements_type.TEXTFIELD} onDelete={onDelete} />
      <div className="p-4">
        <InputField
          value={label || ""}
          label="Label"
          id={`textFieldName_${selectedNodeId}`} // Using selectedNodeId for unique id
          placeHolder={label || "Label"}
          onChange={(value) => {
            const updatedData = {
              ...data,
              label: value,
            };
            setData(updatedData);
            onChange(updatedData, false);
          }}
          onBlur={() => {
            const updatedData = {
              ...data,
              label: data.label.trim(),
            };
            setData(updatedData);
            onChange(updatedData);
          }}
        />
        <InputField
          value={placeHolder || ""}
          label="Placeholder"
          id={`placeholderName_${selectedNodeId}`} // Using selectedNodeId for unique id
          placeHolder={placeHolder || "Placeholder"}
          onChange={(value) => {
            const updatedData = {
              ...data,
              placeholder: value,
            };
            setData(updatedData);
            onChange(updatedData, false);
          }}
          onBlur={() => {
            const updatedData = {
              ...data,
              label: data.label.trim(),
            };
            setData(updatedData);
            onChange(updatedData);
          }}
        />
      </div>
    </div>
  );
};

export default TextField;
