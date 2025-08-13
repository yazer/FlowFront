import {
  MdOutlineArrowDropDownCircle,
  MdOutlineCalendarToday,
  MdOutlineCheckBox,
  MdOutlineFileUpload,
  MdOutlineToggleOn,
  MdTextFields,
  MdTitle,
  MdViewList,
  MdDateRange,
  MdRadioButtonChecked,
} from "react-icons/md";

import { GoDatabase } from "react-icons/go";
import { FaTable } from "react-icons/fa";

import { ImUpload2 } from "react-icons/im";
import { FaObjectGroup } from "react-icons/fa";
import { TbSignature } from "react-icons/tb";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuLayoutTemplate } from "react-icons/lu";
import { BsCloudUpload, BsTextareaResize } from "react-icons/bs";
import { SiConvertio } from "react-icons/si";

export const CUSTOM_TEMPLATE_ID = "5f5c74e3-624d-4db1-88b3-0db69f6fc631";

export const elements_type = {
  TITLE: "TITLE",
  GROUPFIELDS: "GROUPFIELDS",
  TEXTFIELD: "TEXT_FIELD",
  CHECKBOX: "CHECKBOX",
  DROPDOWN: "DROP_DOWN",
  UPLOAD_DATA_DYN: "UPLOAD_DATA_DYN",
  FILEUPLOAD: "FILE_UPLOAD",
  DATE: "DATE",
  DATE_TIME: "DATE_TIME",
  RADIOBUTTON: "RADIO_BUTTON",
  MULTIFILEUPLOAD: "MULTI_FILE_UPLOAD",
  MULTISELECTDROPDOWN: "MULTISELECTDROPDOWN",
  TOGGLE: "TOGGLE",
  STAGE: "STAGE",
  DIGITASIGNATURE: "DIGITAL_SIGNATURE",
  CASCADINGDROPDOWN: "CASCADINGDROPDOWN",
  LOCATION: "LOCATION",
  DATAGRID: "DATAGRID",
  SEARCHDATA: "SEARCHDATA",
  GRID: "GRID",
  MULTILINETEXTFIELD: "MULTI_LINE_TEXT_FIELD",
  CONVERT_IMAGE: "CONVERT_IMAGES",
};

export const elements = [
  {
    type: elements_type.GRID,
    label: "Grid Layout",
    icon: LuLayoutTemplate,
  },
  {
    type: elements_type.TITLE,
    label: "title",
    icon: MdTitle,
  },
  {
    type: elements_type.TOGGLE,
    label: "toggle",
    icon: MdOutlineToggleOn,
  },
  {
    type: elements_type.TEXTFIELD,
    label: "textField",
    icon: MdTextFields,
  },
  {
    type: elements_type.MULTILINETEXTFIELD,
    label: "multiLineTextField",
    icon: BsTextareaResize,
  },
  {
    type: elements_type.RADIOBUTTON,
    label: "radioButton",
    icon: MdRadioButtonChecked,
  },
  {
    type: elements_type.CHECKBOX,
    label: "checkBox",
    icon: MdOutlineCheckBox,
  },
  {
    type: elements_type.DROPDOWN,
    label: "dropDown",
    icon: MdOutlineArrowDropDownCircle,
  },
  {
    type: elements_type.MULTISELECTDROPDOWN,
    label: "multiSelectDropDown",
    icon: MdViewList,
  },
  {
    type: elements_type.FILEUPLOAD,
    label: "fileUpload",
    icon: MdOutlineFileUpload,
  },
  {
    type: elements_type.CONVERT_IMAGE,
    label: "convertImage",
    icon: SiConvertio,
  },
  {
    type: elements_type.MULTIFILEUPLOAD,
    label: "multiFileUpload",
    icon: ImUpload2,
  },
  {
    type: elements_type.UPLOAD_DATA_DYN,
    label: "uploadDynamicData",
    icon: BsCloudUpload,
  },
  {
    type: elements_type.DATE,
    label: "date",
    icon: MdOutlineCalendarToday,
  },
  {
    type: elements_type.DATE_TIME,
    label: "dateTime",
    icon: MdDateRange,
  },
  {
    type: elements_type.DIGITASIGNATURE,
    label: "digitalSignature",
    icon: TbSignature,
  },
  {
    type: elements_type.LOCATION,
    label: "Location",
    icon: FaMapMarkedAlt,
  },
  {
    type: elements_type.DATAGRID,
    label: "Data Grid",
    icon: FaTable,
  },
  {
    type: elements_type.SEARCHDATA,
    label: "SearchData",
    icon: GoDatabase,
  },
];

export const languages = ["en", "ar"];
