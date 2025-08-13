import { Typography } from "@mui/material";
import { MdOutlineSearch } from "react-icons/md";

interface InputProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: string;
  label?: string;
  prepend?: React.ReactNode;
  value?: string;
  showSearchIcon?: boolean;
  error?: boolean;
  helperText?: string;
}

export function Input({
  name,
  placeHolder,
  onChange,
  label,
  prepend,
  value,
  showSearchIcon,
  error,
  helperText,
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && <Typography variant="subtitle1">{label}</Typography>}
      <div
        className={`border ${
          error ? "border-red-500" : "border-gray-400"
        } rounded-md my-2 w-full overflow-hidden flex flex-row items-center ${
          prepend ? "pl-2" : ""
        }`}
      >
        {prepend && <span className="mr-2">{prepend}</span>}
        <input
          value={value}
          type="text"
          name={name}
          placeholder={placeHolder || ""}
          className={`w-full p-2 ${error ? "text-red-500" : ""}`}
          onChange={onChange}
        />
        {showSearchIcon && (
          <span className="mr-2">
            <MdOutlineSearch />
          </span>
        )}
      </div>
      {error && helperText && (
        <Typography variant="body2" color="error">
          {helperText}
        </Typography>
      )}
    </div>
  );
}

export default Input;
