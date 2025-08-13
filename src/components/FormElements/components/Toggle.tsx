import React, { FC } from "react";

interface ToggleInterface {
  label: string;
  isChecked?: boolean;
  name?: string;
  onChange: (e: any) => void;
  readOnly?: boolean;
}

const ToggleField: FC<ToggleInterface> = ({
  label,
  isChecked = false,
  name,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="flex items-center">
      <label htmlFor={name} className="mr-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          readOnly={readOnly}
          type="checkbox"
          id={name}
          name={name}
          checked={isChecked}
          onChange={(e: any) => onChange(e)}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 bg-gray-200 rounded-full ${
            isChecked ? "bg-blue-600" : ""
          } transition-colors duration-300 ease-in-out`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out transform ${
              isChecked ? "translate-x-4" : ""
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ToggleField;
