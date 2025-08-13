import React, { FC, useState } from "react";
import Heading from "./components/Heading";
import InputField from "./components/InputField";
import CheckBox from "./components/CheckBox";
import { elements_type } from "./constants";

interface TextFieldInterface {
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  label: string;
  value?: string;
  required?: boolean;
  hidden?: boolean;
  readonly?: boolean;
}

const FormCheckBox: FC<TextFieldInterface> = ({
  onDelete,
  onChange,
  label,
  value,
}) => {
  const [data, setData] = useState({
    label,
    value,
    element_type: "INP",
    input_type: elements_type.CHECKBOX,
    required: true,
    hidden: false,
    readonly: false,
  });

  // This function updates the state and triggers the parent `onChange` callback
  function updateData(
    name: string,
    value: boolean | string,
    call_api?: boolean
  ) {
    const updatedData = {
      ...data,
      [name]: value,
    };
    setData(updatedData);
    onChange(updatedData, call_api); // Trigger the update when the field loses focus or on change
  }

  return (
    <div className="border-[1px] rounded bg-white">
      <Heading type={elements_type.CHECKBOX} onDelete={onDelete} />

      <div className="p-4">
        {/* Update label and value onBlur */}
        <InputField
          label="label"
          id="checkBoxName"
          placeHolder="Label"
          value={data.label}
          onChange={(value) => updateData("label", value, false)} // Update on change
          onBlur={() => updateData("label", data.label)} // Trigger update on blur
        />
        <InputField
          label="value"
          id="value"
          value={data.value}
          placeHolder="Value"
          onChange={(value) => updateData("value", value, false)} // Update on change
          onBlur={() => updateData("value", data.value || "")} // Trigger update on blur
        />
      </div>

      <div className="flex pl-4 pr-4 pb-4 justify-between">
        {/* These CheckBoxes will trigger update immediately on change */}
        <CheckBox
          label="Required"
          isChecked={data.required}
          onChange={(e) => updateData("required", e.target.checked)}
        />
        <CheckBox
          label="Read Only"
          isChecked={data.readonly}
          onChange={(e) => updateData("readonly", e.target.checked)}
        />
        <CheckBox
          label="Hidden"
          isChecked={data.hidden}
          onChange={(e) => updateData("hidden", e.target.checked)}
        />
      </div>
    </div>
  );
};

export default FormCheckBox;
