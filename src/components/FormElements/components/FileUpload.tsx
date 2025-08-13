import { Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useTranslation from "../../../hooks/useTranslation";

interface FileUploadProps {
  name: string;
  label?: string | React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prepend?: React.ReactNode;
  value?: File | null;
  disabled?: boolean;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  onChange,
  prepend,
  value,
  disabled = false,
  accept = "*",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(value?.name ?? null);
  const { translate } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file?.name ?? null);
    onChange(e);
  };

  useEffect(() => {
    setFileName(value?.name ?? null);
  }, [value]);

  return (
    <div className="w-full">
      {label && (
        <Typography
          variant="subtitle1"
          textTransform={"capitalize"}
          mb={"0.35em"}
        >
          {label}
        </Typography>
      )}
      <div
        className={`relative shadow border rounded w-full flex items-center leading-tight bg-white mb-1 ${
          prepend ? "pl-2" : ""
        }`}
      >
        {prepend && <span className="mr-2">{prepend}</span>}

        {/* Custom text display for filename */}
        <input
          type="text"
          readOnly
          value={fileName ?? ""}
          placeholder={translate("noFileSelected") ?? "No file selected"}
          className={`w-full p-2 text-base bg-white rounded focus:outline-none cursor-default
    ${
      disabled
        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
        : "text-gray-700"
    }
  `}
          disabled={disabled}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`absolute right-0 top-0 bottom-0 px-4 text-sm font-medium border-l h-auto
    ${
      disabled
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
    }
  `}
        >
          {translate("browse") ?? "Browse"}
        </button>

        {/* Hidden actual file input */}
        <input
          ref={fileInputRef}
          accept={accept}
          disabled={disabled}
          type="file"
          id={name}
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUpload;
