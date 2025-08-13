import { Button, ButtonProps } from "@mui/material";
import React from "react";
import { useOrganization } from "../../context/OrganizationContext";
import { matchScreenKey } from "../../utils/permissions";
import { useLocation } from "react-router";
import { BsPlus } from "react-icons/bs";
import { Add } from "@mui/icons-material";

function CreateButton({
  children,
  onClick,
  variant = "contained",
  ...rest
}: ButtonProps) {
  const location = useLocation();

  const { usePermissions } = useOrganization();

  const { canWrite } = usePermissions(matchScreenKey(location.pathname));

  return (
    <>
      <Button
        {...rest}
        variant={variant}
        startIcon={<Add />}
        disabled={!canWrite}
        onClick={(e) => {
          if (canWrite) {
            onClick?.(e);
          }
        }}
      >
        {children}
      </Button>
    </>
  );
}

export default CreateButton;
