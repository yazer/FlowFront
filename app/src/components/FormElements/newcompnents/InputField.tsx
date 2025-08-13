import { FormHelperText, IconButton, InputAdornment } from "@mui/material";
import React, { FC, useState } from "react";
import FormLabel from "../components/FormLabel";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InputFieldInterface {
  value?: string;
  label: string | React.ReactNode;
  name?: string;
  placeholder?: string;
  onChange?: (value: string, e: any) => void;
  onBlur?: (value: string, e: any) => void;
  type?: string;
  readOnly?: boolean;
  min?: string;
  max?: string;
  error?: boolean;
  helperText?: string;
  accept?: string;
  disabled?: boolean;
}

const InputField: FC<InputFieldInterface> = ({
  value,
  label,
  placeholder = "Enter the value here",
  onChange,
  onBlur,
  error,
  readOnly = false,
  helperText,
  accept,
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full relative">
      {label && <FormLabel label={label} />}
      <div
        className={`flex justify-between shadow appearance-none border rounded w-full focus:shadow-outline focus:outline-none ${
          error ? "border-red-500" : ""
        } ${props?.disabled ? "text-gray-400 cursor-not-allowed" : ""}`}
      >
        <input
          {...props}
          readOnly={readOnly}
          type={inputType}
          value={value}
          className={`w-full py-2 px-3 pr-10 text-gray-700 overflow-hidden rounded disabled:text-gray-400 disabled:cursor-not-allowed`}
          placeholder={placeholder}
          onChange={(e) => onChange && onChange(e.target.value, e)}
          onBlur={(e) => onBlur && onBlur(e.target.value, e)}
          accept={accept}
        />

        {isPassword && (
          <IconButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="mr-2"
            size="small"
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </IconButton>
        )}
      </div>

      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </div>
  );
};

export default InputField;
