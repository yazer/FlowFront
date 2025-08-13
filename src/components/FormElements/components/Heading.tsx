import { ToggleOnOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { FC } from "react";
import {
  MdDeleteOutline,
  MdDragIndicator,
  MdKeyboardArrowDown,
  MdOutlineArrowDropDownCircle,
  MdOutlineCalendarToday,
  MdOutlineCheckBox,
  MdOutlineFileUpload,
  MdOutlineRadioButtonChecked,
  MdTextFields,
  MdTitle,
} from "react-icons/md";
import { elements, elements_type } from "../constants";
interface HeadingInterface {
  type: string;
  onDelete: () => any;
}

const Icon = ({ type }: { type?: string }) => {
  switch (type) {
    case elements_type.TITLE:
      return <MdTitle className="w-5 h-5" />;
    case elements_type.TEXTFIELD:
      return <MdTextFields className="w-5 h-5" />;
    case elements_type.CHECKBOX:
      return <MdOutlineCheckBox className="w-5 h-5" />;
    case elements_type.DROPDOWN:
      return <MdOutlineArrowDropDownCircle className="w-5 h-5" />;
    case elements_type.FILEUPLOAD:
      return <MdOutlineFileUpload className="w-5 h-5" />;
    case elements_type.DATE:
      return <MdOutlineCalendarToday className="w-5 h-5" />;
    case elements_type.RADIOBUTTON:
      return <MdOutlineRadioButtonChecked className="w-5 h-5" />;
    case elements_type.MULTIFILEUPLOAD:
      return <MdOutlineFileUpload className="w-5 h-5" />;
    case elements_type.TOGGLE:
      return <ToggleOnOutlined className="w-5 h-5" />;
    case elements_type.STAGE:
      return <MdOutlineFileUpload className="w-5 h-5" />;
    default:
      return <MdTitle className="w-5 h-5" />;
  }
};

const Heading: FC<HeadingInterface> = ({ type, onDelete }) => {
  const elementType = elements.find((x) => x.type === type);
  return (
    <div
      id={`editor_${elementType?.type}`}
      draggable
      // onDragStart={(e) => handleDragStart(e, element.type)}
      className="p-3 mb-2rounded-md flex border-[1px] justify-between gap-1 items-center hover:cursor-grab border-grey-400 border-t-0 border-l-0 border-r-0 border-b-1"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <MdDragIndicator className="fill-slate-400" />
          <Icon type={elementType?.type} />
          <span className="font-medium text-sm">{elementType?.label}</span>
        </div>
        <Stack direction="row" spacing={1}>
          <button
            type="button"
            onClick={onDelete}
            className="ml-1 tfont inline-flex items-center text-center text-lg"
          >
            <MdDeleteOutline />
          </button>

          <MdKeyboardArrowDown />
        </Stack>
      </div>
    </div>
  );
};
export default Heading;
