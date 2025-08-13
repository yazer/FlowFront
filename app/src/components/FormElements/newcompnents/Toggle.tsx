import { FC, useState } from "react";
import Heading from "./Heading";
import InputField from "./InputField";
// import StageTitle from "../newcomponents/StageTitle";
import { elements_type } from "../constants";

interface ToggleInterface {
  onDelete: () => void;
  label: string;
  required?: boolean;
  defaultChecked?: boolean;
  // onChange: (data: any) => void;
  onBlur: (value: any) => void;
}
const Toggle: FC<ToggleInterface> = ({ onDelete, label, onBlur }) => {
  const [data, setData] = useState({
    label,
    input_type: elements_type.TOGGLE,
    required: false,
    defaultChecked: false,
  });

  const handleChange = (value: string) => {
    const updatedData = {
      ...data,
      label: value, // Dynamically update either label or placeholder
    };
    setData(updatedData);
  };

  return (
    <>
      <div className="border-[1px] rounded mt-2 mb-2">
        <Heading type={elements_type.TOGGLE} onDelete={onDelete} />
        <div className="p-4">
          <InputField
            label="label"
            placeholder="Label"
            value={data.label}
            onChange={(value) => handleChange(value)}
            onBlur={() => onBlur(data.label)}
          />
          <div className="flex justify-between">
            {/* <CheckBox
              label="Required"
              isChecked={data.required}
              onChange={(e) => onChangeToggle("required", e.target.checked)}
            />
            <CheckBox
              label="Default Checked"
              isChecked={data.defaultChecked}
              onChange={(e) =>
                onChangeToggle("defaultChecked", e.target.checked)
              }
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Toggle;
