import { TextField } from "@mui/material";
import React from "react";

function TextFieldToText({
  value,
  editable = true,
  onChange = (value: string) => {}, // Default no-op change handler
}: {
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void; // Optional change handler
}) {
  const [isEditing, setIsEditing] = React.useState(true);

  return (
    <div className="cursor-auto">
      {isEditing ? (
        <div>
          <TextField
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }} // Handle change as needed
            onBlur={() => setIsEditing(false)}
            autoFocus
            variant="standard"
          />
        </div>
      ) : (
        <button
          onClick={() => {
            setIsEditing(editable);
          }}
        >
          {value || "Click to edit"}
        </button>
      )}
    </div>
  );
}

export default TextFieldToText;
