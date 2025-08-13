import { useEffect, useMemo, useRef, useState } from "react";
import { useReactFlow } from "reactflow";
import useTranslation from "../../hooks/useTranslation";
import InputField from "../../components/FormElements/newcompnents/InputField";
import { Avatar } from "@mui/material";

interface MultiSelectDropdownProps {
  options: any[];
  id: string;
  placeholder: any;
  search?: boolean;
  value: string[];
  onChange: (values: string) => void;
  optionComponent?: any;
}

const MultiSelectDropdownNode: React.FC<MultiSelectDropdownProps> = ({
  options,
  id,
  placeholder,
  search = false,
  value,
  onChange,
  optionComponent
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const selected = reactFlowInstance.getNode(id)?.selected;
  const [searchText, setSearchText] = useState("");
  const { translate } = useTranslation();

  useEffect(() => {
    setIsOpen(false);
  }, [selected]);

  // 🔐 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const optionsFilter = useMemo(
    () => options.filter((x) => x.label.toLowerCase().includes(searchText.toLowerCase())),
    [searchText, options]
  );

  const getDisplayText = (): string =>
    value.length > 0
      ? options
          .filter((item) => value.includes(item.value))
          .map((x) => x.label)
          .join(", ")
      : placeholder;

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm flex justify-between items-center"
        onClick={toggleDropdown}
      >
        <span className="text-gray-700 overflow-hidden truncate">{getDisplayText()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 py-2">
          {search && (
            <div className="px-2">
              <InputField
                label=""
                value={searchText}
                placeholder="Search Options"
                onChange={(value) => {
                  setSearchText(value);
                }}
              />
            </div>
          )}
          {optionsFilter.map((option) => (
            <label
              key={option.value}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => onChange(option.value)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
              {option?.imgUrl && (
                <Avatar
                  src={option.imgUrl}
                  sx={{ width: 32, height: 32, bgcolor: "primary.main", ml: 2 }}
                >
                  {!option?.profileImg && option?.label?.charAt(0)}
                </Avatar>
              )}
              <span className="ml-2 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdownNode;
