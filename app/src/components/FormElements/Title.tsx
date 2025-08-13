import React, { FC, useState } from "react";
import InputField from "./components/InputField";
import Heading from "./components/Heading";
import { elements_type } from "./constants";
import { updateTranslationData } from "./formTranslations";

interface TextProps {
  onDelete: () => void;
  onChange: (data: any, api_call: boolean) => void; // Pass api_call as a second argument
  title: string;
  selectedNodeId: string;
  activeLanguage: string;
}

const Text: FC<TextProps> = ({
  onDelete,
  onChange,
  title,
  selectedNodeId,
  activeLanguage,
}) => {
  const [data, setData] = useState({
    label: "",
    placeholder: "",
    element_type: "INP",
    input_type: elements_type.TITLE,
    title: title || "",
  });

  const [apiCall, setApiCall] = useState(true); // State to track if API should be called

  // Handle changes in the title field
  const handleChange = (value: string) => {
    // const updatedData = {
    //   ...data,
    //   title: value,
    // };
    const updatedData = updateTranslationData(
      data,
      "label",
      elements_type.TITLE,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, apiCall); // Pass apiCall state to the parent
  };

  return (
    <div className="border-[1px] rounded-md bg-white">
      <Heading type={elements_type.TITLE} onDelete={onDelete} />
      <div className="p-4">
        <InputField
          value={data.title}
          label="Title"
          id="textFieldName"
          placeHolder={data.placeholder || "Label"}
          // Set apiCall to false before calling handleChange in onChange event
          onChange={(value: string) => {
            setApiCall(false);
            handleChange(value);
          }}
          // Set apiCall to true before calling handleChange in onBlur event
          onBlur={() => {
            setApiCall(true);
            handleChange(data.title);
          }}
        />
      </div>
    </div>
  );
};

export default Text;
