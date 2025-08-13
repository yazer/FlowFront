import { Typography } from "@mui/material";
import React from "react";
import { MdDragIndicator } from "react-icons/md";
import { useIntl } from "react-intl";
import { elements_type } from "../../components/FormElements/constants";
import { Draggable } from "./Draggable";

export const components = [
  {
    id: "btn3",
    label: "Button",
    position: { x: 160, y: 60 },
    size: { width: 100, height: 40 },
    type: "button",
  },
  {
    id: "text1",
    type: "text",
    label: "Text",
    position: { x: 160, y: 60 },
    size: { width: 100, height: 40 },
  },
  {
    id: "Image1",
    type: "image",
    label: "Image",
    position: { x: 160, y: 60 },
    size: { width: 100, height: 40 },
  },
  {
    id: "heading1",
    type: "heading",
    label: "Heading",
    position: { x: 160, y: 60 },
    size: { width: 100, height: 40 },
  },
];

function SideBar({
  formFields,
  setSections,
  setSelectedSection,
}: {
  formFields: any[];
  setSections: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedSection: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { locale } = useIntl();

  function getLabel(data: any) {
    return data.translate?.[locale]?.label || data.label || data.element_type;
  }

  return (
    <div className="flex flex-col p-4 w-64 h-full bg-white m-2 gap-6 rounded-sm">
      <SideBarSectionRapper>
        <SideBarSectionTitle title="Form Fields" />

        <SideBarSectionContent>
          {formFields.map((comp) => (
            <Draggable
              className="w-full cursor-move"
              key={comp.id}
              id={comp.id}
              data={{ new: true, ...comp }}
            >
              {comp.element_type === elements_type.DATAGRID ? (
                <></>
              ) : (
                <SideBarItem className="flex items-center gap-2 cursor-move">
                  <MdDragIndicator />
                  <span>{getLabel(comp)}</span>
                </SideBarItem>
              )}
            </Draggable>
          ))}
        </SideBarSectionContent>
      </SideBarSectionRapper>

      <SideBarSectionRapper>
        <SideBarSectionTitle title="Components" />

        <SideBarSectionContent>
          <Draggable
            className="w-full text-left"
            id={"textfield"}
            data={{
              new: true,
              id: "textfield",
              type: "textfield",
              value: "",
            }}
          >
            <SideBarItem>Add Textfield</SideBarItem>
          </Draggable>
          <Draggable
            className="w-full text-left"
            id={"imageuploader"}
            data={{
              new: true,
              id: "imageuploader",
              type: "image",
              value: "",
            }}
          >
            <SideBarItem>Add Image</SideBarItem>
          </Draggable>
        </SideBarSectionContent>
      </SideBarSectionRapper>

      {formFields.filter((form) => form.element_type === elements_type.DATAGRID)
        .length ? (
        <SideBarSectionRapper>
          <SideBarSectionTitle title="Data Grids" />
          <SideBarSectionContent>
            {formFields
              .filter((form) => form.element_type === elements_type.DATAGRID)
              .map((form) => (
                <div
                  key={form.id}
                  className="cursor-pointer"
                  onClick={() => setSections((prev) => [...prev, form])}
                >
                  {getLabel(form)}
                </div>
              ))}
          </SideBarSectionContent>
        </SideBarSectionRapper>
      ) : null}

      <SideBarSectionRapper>
        <SideBarSectionTitle title="Section" />
        <SideBarSectionContent>
          <SideBarItem
            handleClick={() =>
              setSections((prev) => [
                ...prev,
                { id: Date.now(), type: "section", items: [] },
              ])
            }
          >
            Add Sections
          </SideBarItem>
          <SideBarItem
            handleClick={() =>
              setSections((prev) => [
                ...prev,
                { id: Date.now(), type: "custom_table", items: [] },
              ])
            }
          >
            Add Custom table
          </SideBarItem>
        </SideBarSectionContent>
      </SideBarSectionRapper>
    </div>
  );
}

export default SideBar;

function SideBarSectionRapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

function SideBarSectionTitle({ title }: { title: string }) {
  return (
    <Typography variant="h6" color="textSecondary" gutterBottom>
      {title}
    </Typography>
  );
}

function SideBarSectionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-2 flex w-full flex-col items-start">{children}</div>
  );
}

function SideBarItem({
  children,
  handleClick,
  className = "",
}: {
  children: React.ReactNode;
  handleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}) {
  return (
    <div
      className={`hover:bg-gray-100 p-2 rounded-md cursor-pointer w-[100%] ${className} text-sm`}
      onClick={(e) => handleClick?.(e)}
    >
      {children}
    </div>
  );
}
