import React from "react";
import DialogCustomized from "../DialogCustomized";
import { Button, Stack, Typography } from "@mui/material";
import useTranslation from "../../../hooks/useTranslation";

function DeleteDialog({
  open,
  handleClose,
  text,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  text: string | React.ReactNode;
  title?: string;
  handleSubmit: () => void;
}) {
  const { translate } = useTranslation();

  return (
    <DialogCustomized
      open={open}
      handleClose={handleClose}
      content={<Typography variant="h5">{text}</Typography>}
      actions={
        <Stack direction="row" spacing={2}>
          <Button onClick={handleClose}>{translate("cancel")}</Button>
          <Button variant="contained" disableElevation onClick={handleSubmit}>
            {translate("submitButton")}
          </Button>
        </Stack>
      }
      title={
        <Typography variant="h6">
          {translate("deleteConfirmationTitle")}
        </Typography>
      }
    />
  );
}

export default DeleteDialog;
