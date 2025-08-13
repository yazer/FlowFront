import React, { FC } from "react";
import {
  MdArrowDownward,
  MdDeleteOutline,
  MdEdit,
  MdKeyboardArrowDown,
} from "react-icons/md";

interface StageTitleInterface {
  onDelete: () => void;
}
const StageTitle: FC<StageTitleInterface> = ({ onDelete }) => {
  return (
    <div className="flex mt-4">
      {/* <h6 className="font-medium text-sm">Stage Title</h6> */}

      {/* <button
        onClick={() => {}}
        className="ml-6 tfont inline-flex items-center text-center text-lg"
      >
        <MdEdit />
      </button> */}
      {/* <button
        type="button"
        onClick={onDelete}
        className="ml-1 tfont inline-flex items-center text-center text-lg"
      >
        <MdDeleteOutline />
      </button> */}
    </div>
  );
};

export default StageTitle;
