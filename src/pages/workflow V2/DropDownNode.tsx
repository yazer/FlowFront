import React, { useState, useRef, useEffect, useMemo } from "react";
import { useReactFlow } from "reactflow";

interface SingleSelectDropdownProps {
  options: string[] | { value: string; label: string }[];
  placeholder?: string | React.ReactNode;
  onSelect?: (selected: string) => void;
  onChange?: (selected: string | null) => void;
  id: string;
  disabled?: boolean;
  value?: string;
}

const DropDownNode: React.FC<SingleSelectDropdownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
  onChange,
  id,
  disabled = false,
  value,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const selected = reactFlowInstance.getNode(id)?.selected;

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (option: string) => {
    if (!disabled) {
      setSelectedOption(option);
      onSelect?.(option);
      onChange?.(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      setIsOpen(false);
    }
  }, [selected]);

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const optionHash: any = useMemo(() => {
    return (options as any[])?.reduce(
      (prev: any, curr: any) => ({
        ...prev,
        [curr?.value ? curr?.value : curr]: curr,
      }),
      {}
    );
  }, [options]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        onClick={toggleDropdown}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm flex justify-between items-center ${
          disabled
            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white border-gray-300 text-gray-700"
        }`}
        disabled={disabled}
      >
        <span>{optionHash?.[selectedOption || ""]?.label || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${disabled ? "text-gray-400" : "text-gray-700"}`}
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
      {isOpen && !disabled && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option: any, idx: number) => {
            const optValue = option?.value || option;
            return (
              <div
                key={optValue}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  selectedOption === optValue ? "bg-gray-100 font-medium" : ""
                }`}
                onClick={() => handleOptionClick(optValue)}
              >
                {option?.label || option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDownNode;
