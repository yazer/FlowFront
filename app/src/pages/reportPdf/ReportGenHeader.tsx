/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, IconButton, MenuItem, Select } from "@mui/material";
import React, { useId, useMemo } from "react";
import { MdDelete, MdDownload } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import generatePDF from "react-to-pdf";
import { elements_type } from "../../components/FormElements/constants";
import TextToggleGroup from "./components/TextToggleGroup";
import { ButtonItem } from "./FreeMoveContainer";
import { MdFormatColorText } from "react-icons/md";
import { IoMdColorFill } from "react-icons/io";

const fontSize = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
const fonts = ["Arial", "Courier New", "Inter", "Times New Roman", "Verdana"];

function ReportGenHeader({
  isPrint,
  pdfRef,
  selectedItem,
  setIsPreview,
  sections,
  setSections,
  selectedSection,
}: {
  isPrint: boolean;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setSections: React.Dispatch<React.SetStateAction<ButtonItem[]>>;
  pdfRef: any;
  sections: ButtonItem[];
  selectedItem: string | null;
  selectedSection: string | null;
}) {
  const id = useId();
  const selectedIndex: number = useMemo(() => {
    return sections.findIndex((s) => s.id === selectedSection);
  }, [selectedSection]);

  function changeItemStyle<T>(itemVal: T) {
    setSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === selectedSection) {
          return {
            ...section,
            items: section.items?.map((item: ButtonItem) => {
              if (item.id === selectedItem) {
                return { ...item, style: { ...item.style, ...itemVal } };
              }
              return item;
            }),
          };
        }
        return section;
      });
    });
  }

  const item: ButtonItem | undefined = sections[selectedIndex]?.items?.find(
    (item) => item.id === selectedItem
  );
  const isSelectedText = selectedItem
    ? (item && item?.element_type === "text") ||
      item?.type === "textfield" ||
      [
        elements_type.TEXTFIELD,
        elements_type.TITLE,
        elements_type.DATE,
        elements_type.DATE_TIME,
      ].includes(item?.element_type || "")
    : false;

  function deleteItem() {
    setSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.id === selectedSection) {
          return {
            ...section,
            items: section.items?.filter(
              (item: ButtonItem) => item.id !== selectedItem
            ),
          };
        }
        return section;
      });
    });
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isSelectedText) {
      changeItemStyle({
        color: e.target.value,
      });
    } else if (!selectedItem && selectedSection) {
      setSections((prevSections) =>
        prevSections.map((section) =>
          section.id === selectedSection
            ? {
                ...section,
                style: {
                  ...section.style,
                  backgroundColor: e.target.value,
                },
              }
            : section
        )
      );
    }
  }

  if (isPrint) {
    return (
      <Button
        onClick={() => {
          generatePDF(pdfRef, { filename: "page.pdf" });
        }}
        startIcon={<MdDownload />}
      >
        Download PDF
      </Button>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <div className="flex justify-between bg-white m-3 rounded-sm w-[60%] p-3">
        <div className="flex justify-center gap-4 items-center">
          <Select
            className="w-40"
            data-ignore-deselect
            value={item?.style?.fontFamily ? item?.style?.fontFamily : fonts[2]}
            size="small"
            disabled={!isSelectedText}
            onChange={(e) => {
              changeItemStyle({ fontFamily: e.target.value });
            }}
          >
            {fonts.map((font) => (
              <MenuItem key={font} value={font} data-ignore-deselect>
                {font}
              </MenuItem>
            ))}
          </Select>

          <IconButton
            component="label"
            data-ignore-deselect
            htmlFor={id}
            disabled={!isSelectedText && !selectedItem && !selectedSection}
            sx={{
              ...(isSelectedText
                ? { color: item?.style?.color || "#000000" }
                : {
                    backgroundColor: item?.style?.backgroundColor || "#ffffff",
                  }),
            }}
          >
            {selectedItem && isSelectedText ? (
              <MdFormatColorText />
            ) : (
              <IoMdColorFill />
            )}
          </IconButton>
          <input
            style={{ visibility: "hidden" }}
            className="w-0 h-0"
            type="color"
            data-ignore-deselect
            id={id}
            value={
              isSelectedText
                ? item?.style?.color || "#000000"
                : sections[selectedIndex]?.style?.backgroundColor || "#ffffff"
            }
            disabled={!isSelectedText && !selectedItem && !selectedSection}
            onChange={handleColorChange}
          />

          <Select
            data-ignore-deselect
            value={
              item?.style?.fontSize
                ? item?.style?.fontSize.split("p")[0]
                : fontSize[2]
            }
            size="small"
            disabled={!isSelectedText}
            onChange={(e) => {
              changeItemStyle({ fontSize: e.target.value + "px" });
            }}
          >
            {fontSize.map((size) => (
              <MenuItem key={size} value={size} data-ignore-deselect>
                {size}
              </MenuItem>
            ))}
          </Select>

          <TextToggleGroup
            itemStyle={item?.style || {}}
            changeItemStyle={(event, value) =>
              changeItemStyle({
                bold: value.includes("bold"),
                italic: value.includes("italic"),
                underlined: value.includes("underlined"),
                lineThrough: value.includes("lineThrough"),
              })
            }
            disabled={!isSelectedText}
          />

          <IconButton
            data-ignore-deselect
            disabled={!isSelectedText}
            onClick={deleteItem}
          >
            <MdDelete />
          </IconButton>
        </div>
        <div className="flex gap-3">
          <Divider flexItem orientation="vertical" />
          <Button
            onClick={() => {
              setIsPreview(true);
            }}
            startIcon={<VscPreview />}
            size="small"
          >
            Preview PDF
          </Button>
        </div>
      </div>
      <div className="w-64" />
    </div>
  );
}

export default ReportGenHeader;
