import React, { FC, useState } from "react";
import Heading from "./Heading";
import InputField from "./InputField";
import { elements_type } from "../constants";

interface FileInputInterface {
  onDelete: () => void;
  onBlur: (value: string, field: string) => void;
  // onChange: (data: any, call_api?: boolean) => void;
  label?: string;
  isRequired?: boolean;
}

const FileInput: FC<FileInputInterface> = ({
  onDelete,
  onBlur,
  // onChange,
  label = "",
  isRequired = false,
}) => {
  const [data, setData] = useState({
    label: label,
    required: isRequired,
    element_type: "FILE",
    input_type: elements_type.FILEUPLOAD, // Assuming FILE_UPLOAD is in your constants
  });



  // Handle changes in label and required field
  const handleChange = (value: string, fieldType: 'label' | 'placeholder') => {
    const updatedData = {
      ...data,
      [fieldType]: value, // Dynamically update either label or placeholder
    };
    setData(updatedData);
  };

  return (
    <>
      <div className="border-[1px] rounded">
        <Heading type={elements_type.FILEUPLOAD} onDelete={onDelete} />
        <div className="p-4">
          {/* File Upload Label Input */}
          <InputField
            label="Label"
            value={data.label}
            placeholder="Label"
            onChange={(value) => {
              handleChange(value, 'label'); // No API call on change
            }}
            onBlur={(e) => onBlur(e, 'label')}
          />
          <div className="flex justify-between mt-2">
            {/* Checkbox for Required */}
            {/* <CheckBox
              label="Required"
              isChecked={data.required}
              onChange={(e) => handleInputChange("required", e.target.checked, true)}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileInput;
