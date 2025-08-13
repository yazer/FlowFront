import { Collapse } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrganization } from "../../context/OrganizationContext";
import { matchScreenKey, PermissionKeyEnum } from "../../utils/permissions";

export default function SideMenuItem({
  label,
  icon,
  toggleMenu,
  path,
  submenu,
}: {
  label: string;
  icon: JSX.Element;
  toggleMenu: boolean;
  path: string;
  submenu?: { label: string; route: string; icon?: JSX.Element }[];
}) {
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const location = useLocation(); // Get current path for active styling
  const navigate = useNavigate(); // To programmatically navigate

  const { getPermission } = useOrganization();

  const handleSubmenuClick = () => {
    setSubmenuOpen((state) => !state);
    if (!submenu) {
      navigate(path);
    }
  };

  useEffect(() => {
    if (submenu?.map((item) => item?.route).includes(location?.pathname)) {
      setSubmenuOpen(true);
    }
  }, []);

  const isMainMenuVisible = getPermission(
    matchScreenKey(path),
    PermissionKeyEnum.Read
  );
  return (
    <>
      {/* Main menu item */}
      {isMainMenuVisible && (
        <li
          className={`group mx-3 mt-1 mb-2 items-center hover:bg-gray-light rounded-md px-4 cursor-pointer ${
            path === location.pathname ||
            submenu?.some((sub) => sub.route === location.pathname)
              ? "bg-primary text-white"
              : "hover:bg-gray-100 "
          }`}
          onClick={handleSubmenuClick}
        >
          <div
            className={`flex flex-row items-center py-2 ${
              toggleMenu ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex flex-row items-center gap-2">
              {" "}
              <div
                className={
                  path === location.pathname ||
                  submenu?.some((sub) => sub.route === location.pathname)
                    ? "text-white"
                    : "text-gray-800"
                }
              >
                {icon}
              </div>
              <Typography
                variant="h5"
                color="inherit"
                className={`${
                  !toggleMenu
                    ? "opacity-100 block"
                    : "opacity-0 text-[0px] hidden"
                }`}
              >
                <FormattedMessage id={label} />
              </Typography>
            </div>
            {submenu && !toggleMenu && <BsChevronDown />}
          </div>
        </li>
      )}

      {/* Submenu items */}
      {!toggleMenu && submenu && (
        <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
          <ul className="ml-[40px] mr-[20px] list-none">
            {submenu.map((subItem, index) => {
              const isRead = getPermission(
                matchScreenKey(subItem.route),
                PermissionKeyEnum.Read
              );
              return (
                isRead && (
                  <li
                    key={index}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-all duration-200 mb-1 ${
                      location.pathname === subItem.route
                        ? "bg-blue-100 text-[#0060AB]"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      navigate(subItem.route, { state: { _display: false } });
                    }}
                  >
                    {subItem.icon && <span>{subItem.icon}</span>}
                    <Typography variant="subtitle1">
                      <FormattedMessage id={subItem.label} />
                    </Typography>
                  </li>
                )
              );
            })}
          </ul>
        </Collapse>
      )}
    </>
  );
}
