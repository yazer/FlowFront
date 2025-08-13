import { AddOutlined } from "@mui/icons-material";
import { FC, useState } from "react";
import Heading from "./components/Heading";
import InputField from "./components/InputField";
import { elements_type } from "./constants";
import { Typography } from "@mui/material";

interface DropDownInterface {
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  label?: string;
  placeHolder?: string;
  options: optionstype;
}

type optionstype = {
  label: string;
  value: string;
}[];

const DropDown: FC<DropDownInterface> = ({
  onDelete,
  onChange,
  label = "",
  options,
}) => {
  const [data, setData] = useState<{
    label: string;
    options: optionstype;
    input_type: string;
  }>({
    input_type: elements_type.DROPDOWN,
    label,
    options: options?.length ? options : [{ label: "", value: "" }],
  });

  const addInput = () => {
    setData((state: any) => ({
      ...state,
      options: [...state.options, { value: "", label: "" }],
    }));
  };

  // Function to handle changes in dropdown options
  function onClickDropDown(
    ind: number,
    name: string,
    value: string,
    apiCall: boolean
  ) {
    const updatedData = { ...data };

    updatedData.options[ind] = { ...updatedData.options[ind], [name]: value };
    setData(updatedData);
    onChange(updatedData, apiCall);
  }

  return (
    <>
      <div className="border-[1px] rounded">
        <Heading type={elements_type.DROPDOWN} onDelete={onDelete} />
        <div className="p-4">
          <InputField
            label="Label"
            value={label}
            id="checkBoxName"
            placeHolder="Label for dropdown"
            onChange={(value) => {
              const updatedData = {
                ...data,
              };

              updatedData.label = value;
              setData(updatedData);
              onChange(updatedData, false); // No API call on change
            }}
            onBlur={() => onChange(data, true)} // Trigger API call on blur
          />
          <div className="mt-2">
            <Typography variant="h6">Options for DropDown</Typography>
            {data?.options?.map((element, ind) => {
              return (
                <div
                  className="flex justify-between mt-2  gap-x-1 items-center"
                  key={ind}
                >
                  <InputField
                    label="Label"
                    id="optionName"
                    placeHolder="Label for Option"
                    value={element.label}
                    onChange={(e) => {
                      onClickDropDown(ind, "label", e, false);
                    }}
                    onBlur={() => {
                      onClickDropDown(ind, "label", element.label, true);
                    }}
                  />
                  <InputField
                    label="Value"
                    id="optionValue"
                    value={element.value}
                    placeHolder="Value for Option"
                    onChange={(e) => {
                      onClickDropDown(ind, "value", e, false);
                    }}
                    onBlur={() => {
                      onClickDropDown(ind, "value", element.value, true);
                    }}
                  />
                  <button
                    type="button"
                    onClick={addInput}
                    className="text-blue-700 mt-3 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full   p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500"
                  >
                    <AddOutlined />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DropDown;
