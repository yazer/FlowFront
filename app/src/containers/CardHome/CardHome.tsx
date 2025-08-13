import { Typography, Stack, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import formImage from "../../assets/formimage.png";
import { MoreHoriz } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

type cardhomeTypes = {
  name: string;
  description: string;
  icon: React.ReactNode;
};
function CardaHome({ name, description, icon }: cardhomeTypes) {
  return (
    <div className="h-[240px] w-[280px] relative rounded-xl bg-[white]">
      <img
        src={formImage}
        className="h-[40%] w-full object-cover object-top rounded-t-xl"
        alt="formImage"
      />
      <div className="absolute top-0 right-0">
        <BasicMenu />
      </div>
      <div className="p-6">
        <Stack spacing={1}>
          <div>
            <Typography variant="h5">{name}</Typography>
            <Typography
              className="line-clamp-2"
              sx={{ color: "#9f9f9f", minHeight: "40px" }}
              variant="caption"
            >
              {description}
            </Typography>
          </div>

          <div>
            <Typography variant="subtitle1">Created By: Yazer</Typography>
            <Typography variant="caption" sx={{ color: "#9f9f9f" }}>
              19/11/2023
            </Typography>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default CardaHome;

function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "black" }}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <FormattedMessage id="downloadDocuments" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FormattedMessage id="startProcess" />
        </MenuItem>
      </Menu>
    </div>
  );
}
