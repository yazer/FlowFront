import React, { FC, useState } from "react";
import Heading from "./components/Heading";
import InputField from "./components/InputField";
import { AddOutlined } from "@mui/icons-material";
import { elements_type } from "./constants";
import { Typography } from "@mui/material";

interface RadioInterface {
  onDelete: () => void;
  onChange: (data: any, api_call: boolean) => void;
  label: string;
  options?: { label: string; value: string }[];
}

const Radio: FC<RadioInterface> = ({ onDelete, label, onChange, options }) => {
  const [data, setData] = useState({
    label: label,
    input_type: elements_type.RADIOBUTTON,
    options: options?.length ? options : [{ label: "", value: "" }],
  });

  const addInput = () => {
    setData((state: any) => ({
      ...state,
      options: [...state.options, { label: "", value: "" }],
    }));
  };

  function onClickDropDown(
    ind: number,
    name: string,
    value: string,
    api_call: boolean
  ) {
    const updatedData = { ...data };
    updatedData.options[ind] = { ...updatedData.options[ind], [name]: value };
    setData(updatedData);
    onChange(updatedData, api_call);
  }

  return (
    <>
      <div className="border-[1px] rounded bg-white">
        <Heading type={elements_type.RADIOBUTTON} onDelete={onDelete} />
        <div className="p-4">
          {/* Label Input */}
          <InputField
            label="label"
            value={data.label}
            id="checkBoxName"
            placeHolder="Label"
            onChange={(value) => {
              const updatedData = { ...data };
              updatedData.label = value;
              setData(updatedData);
              onChange(updatedData, false);
            }}
            onBlur={() => {
              const updatedData = { ...data };
              updatedData.label = data.label.trim();
              setData(updatedData);
              onChange(updatedData, true);
            }}
          />

          {/* Radio Button Options */}
          <div className="mt-2">
            <Typography variant="h6">Options for Radio Button</Typography>
            {data.options?.map((x, ind) => (
              <div
                className="flex justify-between mt-2 gap-x-1 items-center"
                key={ind}
              >
                {/* Option Label Input */}
                <InputField
                  label="label"
                  id="optionName"
                  placeHolder="Label for Option"
                  value={x.label}
                  onChange={(value) =>
                    onClickDropDown(ind, "label", value, false)
                  }
                  onBlur={() => onClickDropDown(ind, "label", x.label, true)} // Trigger onBlur event
                />
                {/* Option Value Input */}
                <InputField
                  label="value"
                  id="optionValue"
                  value={x.value}
                  placeHolder="Value for Option"
                  onChange={(value) =>
                    onClickDropDown(ind, "value", value, false)
                  }
                  onBlur={() => onClickDropDown(ind, "value", x.value, true)} // Trigger onBlur event
                />
                {/* Add New Input Button */}
                <button
                  type="button"
                  onClick={addInput}
                  className="text-blue-700 mt-3 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                >
                  <AddOutlined />
                  <span className="sr-only">Icon description</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Radio;
