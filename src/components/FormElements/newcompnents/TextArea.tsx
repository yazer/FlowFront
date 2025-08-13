import { FormHelperText } from "@mui/material";
import React, { FC } from "react";
import FormLabel from "../components/FormLabel";

interface InputFieldInterface {
  value?: string;
  label: string | React.ReactNode;
  name?: string;
  placeholder?: string; // Make placeHolder optional
  onChange?: (value: string, e: any) => void; // Make onChange optional
  onBlur?: (Value: string, e: any) => void; // Keep onBlur for focus out updates
  type?: string;
  readOnly?: boolean;
  min?: string;
  max?: string;
  error?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  resize?: string;
  variant?: "no-outline" | "outlined" | "filled"; // Add variant prop for styling
}

const TextArea: FC<InputFieldInterface> = ({
  value = "", // Default to empty string if value is not provided
  label,
  placeholder = "Enter the value here",
  onChange,
  onBlur,
  rows = 3,
  error,
  readOnly = false,
  helperText,
  multiline = false,
  variant = "filled",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <FormLabel label={label} />}
      <textarea
        {...props}
        readOnly={readOnly}
        value={value}
        rows={rows}
        className={`w-full py-2 px-3 text-gray-700 mb-1 
           focus:outline-none focus:shadow-outline
          ${
            variant === "no-outline"
              ? "resize-none outline-none shadow-none border-none"
              : "shadow appearance-none border rounded leading-tight bg-transparent "
          } ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value, e)}
        onBlur={(e) => onBlur && onBlur(e.target.value, e)}
      />
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </div>
  );
};

export default TextArea;
