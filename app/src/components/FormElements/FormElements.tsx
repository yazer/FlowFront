import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import { Stack, Tooltip, Typography } from "@mui/material";
import { MdDragIndicator } from "react-icons/md";
import { elements } from "./constants";
import useTranslation from "../../hooks/useTranslation";

const FormElements = () => {
  const handleDragStart = (ev: any, elementType: string) => {
    ev.dataTransfer.setData("type", elementType);
    ev.dataTransfer.setData("draggedComponent", "ElementsList");
  };

  const { translate } = useTranslation();

  return (
    <div className="p-2 flex flex-col max-h-full Properties overflow-auto">
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          <KeyboardDoubleArrowDown />
        </Typography>
      </Stack>
      <div className="flex flex-col gap-3 mt-4">
        {elements.map((element) => (
          <Tooltip
            key={element.type}
            title={translate(element.label)}
            placement="left"
          >
            <div
              id={element.type}
              draggable
              onDragStart={(e) => handleDragStart(e, element.type)}
              className="p-3 border-[1px] border-gray-300 rounded-md flex justify-between gap-1 items-center hover:cursor-grab"
              style={{ zIndex: 1000 }}
            >
              <div className="flex items-center gap-2">
                <element.icon className="w-5 h-5 text-[#001C39]" />
                {/* <Typography variant="h6">{element.label}</Typography> */}
              </div>
              <MdDragIndicator className="fill-slate-400" />
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default FormElements;
