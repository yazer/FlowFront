import React from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import FormLabel from "../FormElements/components/FormLabel";

interface DropdownProps {
  name?: string;
  label?: string | React.ReactNode;
  options: { [key: string]: any }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  prepend?: React.ReactNode;
  value?: string | number;
  labelKey?: string;
  valueKey?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  noSelectOption?: boolean;
  onBlur?: (e: any) => void; // Keep onBlur for focus out updates
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  options,
  onChange,
  prepend,
  value,
  labelKey = "label",
  valueKey = "value",
  error,
  helperText,
  disabled,
  noSelectOption = false,
  onBlur,
}) => {
  const change = (e: any) => {
    onChange(e);
  };

  return (
    <div className="flex flex-col w-full">
      {label && <FormLabel label={label} />}
      <div
        className={`shadow appearance-none border rounded w-full overflow-hidden flex items-center ${
          prepend ? "pl-2" : ""
        } ${error ? "border-red-500" : ""}`}
      >
        {prepend && <span className="mr-2">{prepend}</span>}
        <select
          id={name}
          name={name}
          onChange={change}
          onBlur={(e) => onBlur && onBlur(e)} 
          className="w-full p-2 text-base text-gray-700 bg-white focus:outline-none  disabled:opacity-50"
          {...(value !== undefined && { value })}
          disabled={disabled}
        >
          {!noSelectOption && (
            <option value="">
              <FormattedMessage id="selectDefaultOption"></FormattedMessage>
            </option>
          )}
          {Array.isArray(options) &&
            options?.map((option, index) => (
              <option
                key={index}
                value={
                  typeof option[valueKey as keyof typeof option] === "object"
                    ? JSON.stringify(option[valueKey as keyof typeof option])
                    : option[valueKey as keyof typeof option]
                }
              >
                {option[labelKey as keyof typeof option]}
              </option>
            ))}
        </select>
      </div>
      {error && helperText && (
        <Typography variant="caption" color="error" mt={1}>
          {helperText}
        </Typography>
      )}
    </div>
  );
};

export default Dropdown;
