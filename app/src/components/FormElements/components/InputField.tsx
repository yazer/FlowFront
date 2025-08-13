import { FormHelperText } from "@mui/material";
import React, { FC } from "react";
import FormLabel from "./FormLabel";

interface InputFieldInterface {
  value?: string;
  label: string;
  id: string;
  placeHolder?: string;
  onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  error?: boolean;
  name?: string;
  helperText?: string;
  min?: any;
  max?: any;
  minlength?: any;
  maxlength?: any;
  required?: any;
  multiline?: any;
  disabled?: any;
}

const InputField: FC<InputFieldInterface> = ({
  value,
  label,
  id,
  placeHolder = "Enter value",
  onChange,
  onBlur = () => {},
  error = false,
  helperText,
  multiline,
  disabled,
  ...props
}) => {
  return (
    <div className="">
      <FormLabel label={label} />
      <input
        value={value}
        {...props}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        id={id}
        placeholder={placeHolder}
        onChange={(e) => onChange(e.target.value, e)}
        onBlur={onBlur}
        aria-invalid={error}
        aria-describedby={`${id}-helper-text`}
        disabled={disabled}
      />
      {error && (
        <FormHelperText
          error={error}
          sx={{ direction: "inherit", textAlign: "inherit" }}
        >
          <>* {helperText}</>
        </FormHelperText>
      )}
    </div>
  );
};

export default InputField;
