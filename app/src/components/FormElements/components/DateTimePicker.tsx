import React from "react";
import { Typography } from "@mui/material";
import FormLabel from "./FormLabel";

interface DatePickerProps {
  name?: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prepend?: React.ReactNode;
  value?: string;
  readOnly?: boolean;
  min?: any;
  max?: any;
}

const DateTimePickerCustom: React.FC<DatePickerProps> = ({
  name,
  label,
  onChange,
  prepend,
  value,
  readOnly = false,
  ...props
}) => {
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // This will trigger the native date picker if it's not read-only
    if (!readOnly) {
      e.currentTarget.showPicker(); // Trigger the date picker manually
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && <FormLabel label={label} />}
      <div
        className={`shadow appearance-none border rounded w-full overflow-hidden flex items-center h-[38px] ${
          prepend ? "pl-2" : ""
        }`}
      >
        {prepend && <span className="mr-2">{prepend}</span>}
        <input
          {...props}
          min={`${props.min}T12:00`}
          max={`${props.max}T12:00`}
          readOnly={readOnly}
          type="datetime-local"
          id={name}
          name={name}
          onChange={onChange}
          onClick={handleInputClick}
          value={value}
          className="w-full p-2 text-base text-gray-700 bg-white focus:outline-none"
        />
      </div>
    </div>
  );
};

export default DateTimePickerCustom;
