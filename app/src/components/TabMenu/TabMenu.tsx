import React from "react";
import useTranslation from "../../hooks/useTranslation";

type TabMenuProps = {
  onChange: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  selected: string;
  tabMenus: { label: string; value: string }[];
};

function TabMenu({ onChange, selected, tabMenus }: TabMenuProps) {
  const { translate } = useTranslation();
  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabMenus.map((tabMenu) => (
            <button
              key={tabMenu.value}
              onClick={(e) => onChange(tabMenu.value, e)}
              className={`px-3 py-2 text-sm font-medium ${
                selected === tabMenu.value
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {translate(tabMenu.label)}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default TabMenu;
