import { Button, ButtonProps, IconButton } from "@mui/material";
import React from "react";
import { useOrganization } from "../../context/OrganizationContext";
import { matchScreenKey } from "../../utils/permissions";
import { useLocation } from "react-router";
import { EditOutlined } from "@mui/icons-material";

function EditButton({
  children,
  onClick,
  size = "small",
  ...rest
}: ButtonProps) {
  const location = useLocation();
  const { usePermissions } = useOrganization();
  const { canEdit } = usePermissions(matchScreenKey(location.pathname));

  return (
    <>
      <IconButton
        {...rest}
        size={size}
        disabled={!canEdit}
        onClick={(e) => {
          if (canEdit) {
            onClick?.(e);
          }
        }}
      >
        <EditOutlined sx={{ height: 18, width: 18 }} />
      </IconButton>
    </>
  );
}

export default EditButton;
