import { useEffect, useRef, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import { FormattedMessage } from "react-intl";

function SearchableDropdown({
  label,
  options,
  selected,
  onChange,
  onChangeSearch,
  disabled,
  placeholder,
}: {
  label: any;
  options: any[];
  selected: string;
  onChange: any;
  onChangeSearch: any;
  disabled?: boolean;
  placeholder: any;
}) {
  const { translate } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options?.find(
    (item: any) => item.value === selected
  )?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={dropdownRef} key="">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : selectedLabel ?? ""}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChangeSearch(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          // onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={translate(placeholder)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        {isOpen && (
          <ul className="absolute z-[1000] w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
            <li
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setIsOpen(false);
                onChange("");
              }}
            >
              <FormattedMessage id="selectDefaultOption" />
            </li>
            {options?.length > 0 ? (
              options?.map((item) => (
                <li
                  key={item?.value}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    onChange(item?.value);
                    setSearchTerm("");
                    onChangeSearch("");
                  }}
                >
                  {item?.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchableDropdown