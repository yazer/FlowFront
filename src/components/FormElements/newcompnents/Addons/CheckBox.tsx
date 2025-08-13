import React, { FC, useId } from "react";

interface CheckBoxInterface {
  label: string;
  isChecked?: boolean;
  name?: string;
  onChange: (e: any) => void;
}
const CheckBox: FC<CheckBoxInterface> = ({
  label,
  isChecked = false,
  name,
  onChange,
}) => {
  const id = useId();
  return (
    <div className="flex items-center">
      <input
        checked={isChecked}
        id={id}
        type="checkbox"
        value=""
        name={name}
        onChange={(e: any) => {
          onChange(e);
        }}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-500"
      >
        {label}
      </label>
    </div>
  );
};

export default CheckBox;
