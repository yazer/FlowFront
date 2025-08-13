import React, { useEffect, useRef, useState } from "react";
import useTranslation from "../../../hooks/useTranslation";
import FormLabel from "./FormLabel";

interface MultiFileUploadProps {
  name: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prepend?: React.ReactNode;
  value?: string[] | null;
  disabled?: boolean;
  accept?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  name,
  label,
  onChange,
  prepend,
  value,
  disabled = false,
  accept = "*",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>(
    value?.map((file: any) => file?.name) ?? []
  );
  const { translate } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const names = files.map((file) => file.name);
    setFileNames(names);
    onChange(e);
  };

  useEffect(() => {
    setFileNames(value?.map((file: any) => file?.name) ?? []);
  }, [value]);

  return (
    <div className="flex flex-col w-full">
      {label && <FormLabel label={label} />}
      <div
        className={`relative shadow border rounded w-full flex items-center bg-white ${
          prepend ? "pl-2" : ""
        }`}
      >
        {prepend && <span className="mr-2">{prepend}</span>}

        {/* Display selected filenames as comma-separated string */}
        <input
          type="text"
          readOnly
          value={fileNames.join(", ")}
          placeholder={translate("noFileSelected") ?? "No file selected"}
          className="w-full p-2 text-base text-gray-700 bg-white focus:outline-none cursor-default"
          disabled={disabled}
        />

        {/* Browse button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="absolute right-0 top-0 bottom-0 px-4 bg-gray-200 hover:bg-gray-300 text-sm font-medium border-l"
        >
          {translate("browse") ?? "Browse"}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          accept={accept}
          multiple
          disabled={disabled}
          type="file"
          id={name}
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Optional file name list */}
      {fileNames.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>{translate("selectedFile")}:</strong>
          <ul className="list-disc pl-5">
            {fileNames.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
