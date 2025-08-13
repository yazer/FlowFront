import { KeyboardEvent, LegacyRef, useEffect, useRef, useState } from "react";
import { MdCheck, MdEdit } from "react-icons/md";
import "./editable-text.scss";
import { Typography } from "@mui/material";

interface EditableTextProps {
  title?: string;
  initialValue: string;
  onSave: (value: any) => void;
  isEdit?: boolean;
  handleChangeIsEdit?: (edit: boolean) => any;
}

const EditableText: React.FC<EditableTextProps> = ({
  title,
  initialValue,
  onSave,
  isEdit,
  handleChangeIsEdit,
}) => {
  const [value, setValue] = useState<string>();
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    isEdit !== undefined && setIsEditMode(isEdit);
  }, [isEdit]);

  const handleClickEditLabel = () => {
    setIsEditMode(true);
    handleChangeIsEdit && handleChangeIsEdit(true);
    inputRef.current?.focus({ preventScroll: false });
  };

  const handleClickSaveLabel = () => {
    setIsEditMode(false);
    handleChangeIsEdit && handleChangeIsEdit(true);
    onSave(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement> | undefined) => {
    if (e?.key === "Enter") {
      handleClickSaveLabel();
    }
  };
  return (
    <div className="editable-text-container">
      {title && <Typography variant="h3">{title}:</Typography>}
      <input
        ref={inputRef}
        disabled={!isEditMode}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        className={
          isEditMode
            ? "border border-1 border-blue-500 px-2"
            : "px-2 bg-transparent"
        }
      />
      {isEditMode ? (
        <button
          onClick={handleClickSaveLabel}
          className="hover:bg-slate-300 rounded-md  px-2 py-1"
        >
          <MdCheck />
        </button>
      ) : (
        <button
          onClick={handleClickEditLabel}
          className="hover:bg-slate-300 rounded-md  px-2 py-1"
        >
          <MdEdit />
        </button>
      )}
    </div>
  );
};

export default EditableText;
