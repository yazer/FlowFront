import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import {
  MdAttachment,
  MdDateRange,
  MdDeleteOutline,
  MdDragIndicator,
  MdKeyboardArrowDown,
  MdOutlineArrowDropDownCircle,
  MdOutlineCalendarToday,
  MdOutlineFileUpload,
  MdOutlineRadioButtonChecked,
  MdTextFields,
  MdTitle,
  MdViewList,
  MdOutlineToggleOn,
} from "react-icons/md";
import { ImUpload2 } from "react-icons/im";
import { FaObjectGroup } from "react-icons/fa";

import { elements, elements_type } from "../constants";
import useTranslation from "../../../hooks/useTranslation";
interface HeadingInterface {
  type: string;
  onDelete: () => any;
  onCollapse?: () => any;
  handleDragStart?: (e: any) => void;
  collapse?: boolean;
}

const Icon = ({ type }: { type?: string }) => {
  switch (type) {
    case elements_type.TITLE:
      return <MdTitle className="w-4 h-4" />;
    case elements_type.TEXTFIELD:
      return <MdTextFields className="w-4 h-4" />;
    case elements_type.DROPDOWN:
      return <MdOutlineArrowDropDownCircle className="w-4 h-4" />;
    case elements_type.MULTISELECTDROPDOWN:
      return <MdViewList className="w-4 h-4" />;
    case elements_type.FILEUPLOAD:
      return <MdOutlineFileUpload className="w-4 h-4" />;
    case elements_type.DATE:
      return <MdOutlineCalendarToday className="w-4 h-4" />;
    case elements_type.DATE_TIME:
      return <MdDateRange className="w-4 h-4" />;
    case elements_type.RADIOBUTTON:
      return <MdOutlineRadioButtonChecked className="w-4 h-4" />;
    case elements_type.MULTIFILEUPLOAD:
      return <ImUpload2 className="w-4 h-4" />;
    case elements_type.GROUPFIELDS:
      return <FaObjectGroup className="w-4 h-4" />;
    case elements_type.TOGGLE:
      return <MdOutlineToggleOn className="w-4 h-4" />;
    case elements_type.STAGE:
      return <MdAttachment className="w-4 h-4" />;
    default:
      return <MdTitle className="w-4 h-4" />;
  }
};

const Heading: FC<HeadingInterface> = ({
  type,
  onDelete,
  onCollapse = () => {},
  handleDragStart = () => {},
  collapse = true,
}) => {
  const elementType = elements.find((x) => x.type === type);
  const { translate } = useTranslation();

  return (
    <div
      id={`editor_${elementType?.type}`}
      draggable
      onDragStart={handleDragStart}
      className="p-1.5 px-3 mb-2rounded-md flex border-[1px] justify-between gap-1 items-center hover:cursor-grab border-grey-400 border-t-0 border-l-0 border-r-0 border-b-1"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <MdDragIndicator className="fill-slate-400" />
          <Icon type={elementType?.type} />
          {/* <span className="font-medium text-sm"> */}
          <Typography variant="subtitle1">
            {translate(elementType?.label || "")}
          </Typography>
          {/* </span> */}
        </div>
        <Stack direction="row" spacing={1}>
          <button
            type="button"
            onClick={onDelete}
            className="ml-1 tfont inline-flex items-center text-center text-sm"
          >
            <MdDeleteOutline />
          </button>

          {collapse && (
            <button
              type="button"
              onClick={onCollapse}
              className="ml-1 tfont inline-flex items-center text-center text-sm"
            >
              <MdKeyboardArrowDown />
            </button>
          )}
        </Stack>
      </div>
    </div>
  );
};
export default Heading;
