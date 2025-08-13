import { Button, ButtonProps, IconButton } from "@mui/material";
import React from "react";
import { useOrganization } from "../../context/OrganizationContext";
import { matchScreenKey } from "../../utils/permissions";
import { useLocation } from "react-router";
import { DeleteOutlineOutlined } from "@mui/icons-material";

function DeleteButton({
  children,
  onClick,
  size = "small",
  ...rest
}: ButtonProps) {
  const location = useLocation();
  const { usePermissions } = useOrganization();
  const { canDelete } = usePermissions(matchScreenKey(location.pathname));

  return (
    <>
      <IconButton
        {...rest}
        size={size}
        disabled={!canDelete}
        onClick={(e) => {
          if (canDelete) {
            onClick?.(e);
          }
        }}
      >
        <DeleteOutlineOutlined sx={{ height: 18, width: 18 }} />
      </IconButton>
    </>
  );
}

export default DeleteButton;
