import React, { useState } from "react";
import {
  ButtonBase,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function FilterChip({
  selected,
  name,
  chipData,
  color,
  onClick,
  onDelete,
  onEdit,
}: {
  selected?: boolean;
  name: string;
  color: string;
  chipData: any;
  onClick: () => any;
  onDelete?: (chipData: object) => any;
  onEdit?: (chipData: object) => any;
}) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Open the menu on right-click
  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <ButtonBase
        title={`${name}`}
        onClick={onClick}
        onContextMenu={handleContextMenu} // Trigger menu on right-click
        sx={{
          background: selected ? color : "transparent",
          border: `1px solid ${color}`,
          color: selected ? "#fff" : color,
          borderRadius: 1,
          padding: "5px 10px",
          width: "fit-content",
        }}
      >
        <Typography
          color="inherit"
          whiteSpace="nowrap"
          variant="body2"
          sx={{
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>
      </ButtonBase>

      {/* Context menu */}
      {onEdit && onDelete && (
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              onEdit(chipData);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              onDelete(chipData);
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      )}
    </>
  );
}

export default FilterChip;
