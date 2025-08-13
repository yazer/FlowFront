import { Typography } from "@mui/material";
import React, { FC } from "react";

interface CheckBoxInterface {
  label: string;
  isChecked?: boolean;
  onChange: (e: any) => void;
  readOnly?: boolean;
  disabled?: boolean
}
const CheckBox: FC<CheckBoxInterface> = ({
  label,
  isChecked = false,
  onChange,
  readOnly = false,
  disabled = false
}) => {
  return (
    <div className="flex items-center">
      <input
        disabled={disabled}
        key={isChecked.toString()}
        readOnly={readOnly}
        checked={isChecked}
        id="checked-checkbox"
        type="checkbox"
        onChange={(e: any) => {
          onChange(e);
        }}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <Typography variant="subtitle1" textTransform={"capitalize"} ml={1}>
        {label}
      </Typography>
      {/* 
        htmlFor="checked-checkbox"
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-900"
      >
        {label}
      </label> */}
    </div>
  );
};

export default CheckBox;
