import { useDraggable } from "@dnd-kit/core";
import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { elements_type } from "../../components/FormElements/constants";
import ImageUploader from "./components/ImageUploader";
import SelectableWrapper from "./components/SelectableWrapper";
import TextFieldToText from "./components/TextFieldToText";
import { useReportGenerationContext } from "./context/ReportGenerationContext";
import { ButtonItem } from "./FreeMoveContainer";

function DraggableItem({
  buttons,
  selectedItem,
  setSelectedItem,
  index = 0,
  isPrint = false,
}: {
  buttons: ButtonItem[];
  selectedItem: string | null;
  setSelectedItem: (id: string | null) => void;
  isPrint?: boolean;
  index?: number;
}) {
  const { locale } = useIntl();
  const { setSections } = useReportGenerationContext();

  const placeholderImage =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  function fieldOnChange(value: Object, btn: ButtonItem) {
    setSections((prevSections) => {
      const section = [...prevSections];
      section[index].items = section[index]?.items?.map((sec) => {
        if (sec.id === btn.id) {
          return {
            ...sec,
            ...value,
          };
        }
        return sec;
      });
      return section;
    });
  }

  const getLabel = (btn: ButtonItem) => {
    return btn.translate?.[locale]?.label || btn.label || btn.element_type;
  };

  return (
    <div>
      {buttons.map((btn) => (
        <DraggableItemWrapper
          id={btn.id}
          key={btn.id}
          position={btn.position}
          selected={selectedItem === btn.id}
          data={btn}
          onSelect={() => {}}
          isPrint={isPrint}
        >
          <SelectableWrapper
            selected={selectedItem === btn.id}
            onSelect={() => setSelectedItem(btn.id)}
            onDeselect={() => setSelectedItem(null)}
            key={btn.id}
            selectBorder="secondary"
          >
            <div
              style={{
                ...btn.style,
                fontWeight: btn.style?.bold ? "bold" : undefined,
                fontStyle: btn.style?.italic ? "italic" : undefined,
                textDecoration: [
                  btn.style?.underlined ? "underline" : "",
                  btn.style?.lineThrough ? "line-through" : "",
                ]
                  .filter(Boolean)
                  .join(" "),
              }}
            >
              {(() => {
                switch (btn.element_type) {
                  case elements_type.TEXTFIELD:
                    return getLabel(btn);
                  case elements_type.DATE:
                    return <span>{"DD/MM/YYYY"}</span>;
                  case elements_type.DATE_TIME:
                    return <span>{"DD/MM/YYYY HH:mm"}</span>;
                  case elements_type.TITLE:
                    return (
                      <Typography variant="h4">
                        {/* @ts-ignore */}
                        {btn?.translate[locale]?.labelTitle}
                      </Typography>
                    );
                  case elements_type.FILEUPLOAD:
                    return (
                      <img
                        src={placeholderImage}
                        className="w-12 h-12"
                        alt={btn.label}
                      />
                    );
                  default:
                    break;
                }
                // Handle type-specific rendering
                switch (btn.type) {
                  case "textfield":
                    return (
                      <TextFieldToText
                        value={btn.value || ""}
                        onChange={(value) => fieldOnChange({ value }, btn)}
                      />
                    );
                  case "image":
                    return !isPrint ? (
                      <ImageUploader
                        imageSrc={btn?.imgSrc || placeholderImage}
                        onImageChange={(src) =>
                          fieldOnChange({ imgSrc: src }, btn)
                        }
                        onDimensionsChange={(dimensions) => {
                          fieldOnChange({ size: { ...dimensions } }, btn);
                        }}
                        dimensions={{
                          width: btn.size?.width || 100,
                          height: btn.size?.height || 100,
                        }}
                        selected={selectedItem === btn.id}
                      />
                    ) : (
                      <img
                        src={btn?.imgSrc || placeholderImage}
                        className={`w-[${btn.size?.width || 100}px] h-[${
                          btn.size?.height || 100
                        }px]`}
                        draggable={false}
                        alt={btn.label}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          </SelectableWrapper>
        </DraggableItemWrapper>
      ))}
    </div>
  );
}

export default DraggableItem;

type Position = { x: number; y: number };

const DraggableItemWrapper = ({
  id,
  children,
  position,
  onSelect,
  isPrint = false,
}: {
  id: string;
  children: React.ReactNode;
  position: Position;
  data?: { [key: string]: any };
  selected: boolean;
  onSelect: (id: string | null) => void;
  isPrint?: boolean;
}) => {
  const { listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const x = transform?.x ?? 0;
  const y = transform?.y ?? 0;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onSelect(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        tabIndex={0}
        onBlur={() => onSelect(null)}
        onFocus={() => onSelect(id)}
        ref={containerRef}
        className={`h-fit w-fit ${isPrint ? "pointer-events-none" : ""}`}
      >
        <div
          ref={setNodeRef}
          {...listeners}
          style={{
            position: "absolute",
            left: position.x + x,
            top: position.y + y,
            cursor: "move",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
