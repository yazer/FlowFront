import { Box, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { NavLink, useLocation } from "react-router-dom";

interface SideMenuItemProps {
  label: string;
  icon: React.ReactNode;
  toggleMenu: boolean;
  path: string;
  submenu?: Array<{ label: string; onClick: () => any }>;
}
export function SideMenuItem({
  label,
  icon,
  toggleMenu,
  path,
  submenu,
}: SideMenuItemProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const selectedMenu = location.pathname === path;

  return (
    <>
      <NavLink to={path} onClick={() => setOpen((state) => !state)}>
        <li
          className={`group mx-3 mt-1 mb-2 items-center hover:bg-[#0060abb3] first-letter:hover:fill-white rounded-md px-4  ${
            path === location.pathname
              ? "bg-primary text-white"
              : "hover:bg-gray-100 text-[#4d4d4d]"
          } }`}
        >
          <div className="flex flex-row items-center py-2 gap-2">
            <Box
              sx={{
                "& .MuiSvgIcon-root": {
                  fill: selectedMenu ? "#fffff" : "#757575",
                },
              }}
              className={
                location.pathname === path ? "text-white" : "text-[#757575]"
              }
            >
              {icon}
            </Box>
            <Typography
              variant="h5"
              color="inherit"
              sx={{ height: "18px" }}
              className={`${
                !toggleMenu ? "opacity-100" : "opacity-0 text-[0px]"
              } `}
              // transition-opacity duration-500 ease-in
            >
              <FormattedMessage id={label} />
            </Typography>
          </div>
        </li>
      </NavLink>
      {!toggleMenu && submenu && (
        <Collapse in={open} unmountOnExit>
          <ul className="ml-[50px] h-[18px]">
            {submenu.map(
              ({ label, onClick }: { label: string; onClick: () => any }) => (
                <li onClick={onClick} className="my-1">
                  <Typography variant="subtitle1"> &#x2022; {label}</Typography>
                </li>
              )
            )}
          </ul>
        </Collapse>
      )}
    </>
  );
}
export default SideMenuItem;
