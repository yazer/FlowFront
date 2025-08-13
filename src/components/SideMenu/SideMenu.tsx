import { AiOutlineHome, AiOutlineInbox } from "react-icons/ai";
import { BiGitBranch, BiTable } from "react-icons/bi";
import { BsCollection, BsTable } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdDoneAll } from "react-icons/md";
import { RiAdminLine, RiDashboardLine } from "react-icons/ri";
import { TiFlowMerge } from "react-icons/ti";
import { VscOrganization, VscServerProcess } from "react-icons/vsc";
import { FormattedMessage } from "react-intl";
import logo from "../../assets/logo.png";
import ArrowIcon from "../Icons/ArrowIcon";
import SideMenuItem from "./SideMenuItemNew";
import { BiTrashAlt } from "react-icons/bi";
export default function SideMenu({
  toggleMenu,
  setToggleMenu,
}: {
  toggleMenu: boolean;
  setToggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`bg-white shadow-lg h-full pb-2 transition-all duration-300 ease-in-out ${
        !toggleMenu ? "w-[250px]" : "w-[83px]"
      } border-r border-gray-300`}
    >
      {/* Toggle button */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <div
            className={`px-2 border-b border-gray-300 flex items-center ${
              toggleMenu ? "justify-center" : "justify-between"
            }`}
          >
            <button
              className="flex flex-row py-3 mx-3 items-center"
              onClick={() => setToggleMenu((prev) => !prev)}
            >
              <ArrowIcon
                className={`fill-gray-600 transform ${
                  toggleMenu ? "rotate-180" : ""
                } transition-transform duration-300`}
              />
              {/* {!toggleMenu && (
                <h5 className="pl-2 font-semibold text-gray-700">
                  <FormattedMessage id="menu" />
                </h5>
              )} */}
            </button>
          </div>

          {/* Menu items */}
          <ul className="mt-4 space-y-2">
            <SideMenuItem
              label="sidemenuHome"
              icon={<AiOutlineHome />}
              toggleMenu={toggleMenu}
              path="/home"
            />
            <SideMenuItem
              label="sidemenuInbox"
              icon={<AiOutlineInbox />}
              toggleMenu={toggleMenu}
              path="/inbox/inprogress"
              submenu={[
                {
                  label: "submenuNew",
                  route: "/inbox/inprogress",
                  icon: (
                    <span>
                      <AiOutlineInbox />
                    </span>
                  ),
                },
                {
                  label: "submenuCompleted",
                  route: "/inbox/completed",
                  icon: (
                    <span>
                      <MdDoneAll />
                    </span>
                  ),
                },
              ]}
            />
            {/* <SideMenuItem
          label="sidemenuFlowBuilder"
          icon={<AccountTreeOutlined />}
          toggleMenu={toggleMenu}
          path="/process-list"
        /> */}
            <SideMenuItem
              label="sidemenuFlowBuilderV2"
              icon={<TiFlowMerge />}
              toggleMenu={toggleMenu}
              path="/process-list-v2"
            />
            {/* className="text-gray-500" */}
            <SideMenuItem
              label="sidemenuDashboard"
              icon={<RiDashboardLine />}
              toggleMenu={toggleMenu}
              path="/dashboards/dashboards"
              submenu={[
                // {
                //   label: "submenuDashboards",
                //   route: "/dashboard/dashboards",
                //   icon: <DashboardCustomizeOutlinedIcon />,
                // },
                // {
                //   label: "submenuChartbuilder",
                //   route: "/dashboard/chart-builder",
                //   icon: <BarChart />,
                // },
                {
                  label: "submenuProcessDashboard",
                  route: "/dashboard/process-dashboard",
                  icon: <RiDashboardLine />,
                },
              ]}
            />
            <SideMenuItem
              label="sidemenuAdmin"
              icon={<RiAdminLine />}
              toggleMenu={toggleMenu}
              path="/administration/organization"
              submenu={[
                // {
                //   label: "submenuDashboards",
                //   route: "/dashboard/dashboards",
                //   icon: <DashboardCustomizeOutlinedIcon />,
                // },
                // {
                //   label: "submenuChartbuilder",
                //   route: "/dashboard/chart-builder",
                //   icon: <BarChart />,
                // },
                {
                  label: "submenuOrganization",
                  route: "/administration/organization",
                  icon: <VscOrganization />,
                },
                {
                  label: "submenuBranch",
                  route: "/administration/organization-branch",
                  icon: <BiGitBranch />,
                },
                {
                  label: "submenuUserList",
                  route: "/administration/user-list",
                  icon: <FiUsers />,
                },
                {
                  label: "submenuAdminProcesses",
                  route: "/administration/processes",
                  icon: <VscServerProcess />,
                },
                {
                  label: "sidemenuRequests",
                  route: "/administration/requests",
                  icon: <AiOutlineInbox />,
                },
                {
                  label: "submenuCategories",
                  route: "/administration/categories",
                  icon: <BsCollection />,
                },
                {
                  label: "submenuGroups",
                  route: "/administration/user-groups",
                  icon: <HiOutlineUserGroup />,
                },
                {
                  label: "database",
                  route: "/administration/parent-tables",
                  icon: <BiTable />,
                },
                {
                  label: "trash",
                  route: "/administration/trash",
                  icon: <BiTrashAlt />,
                },
              ]}
            />
          </ul>
        </div>

        <img
          src={logo}
          alt="Company Logo"
          style={{
            width: "120px",
            height: "40px",
            marginRight: "10px",
            objectFit: "contain",
            alignSelf: "center",
            marginBottom: "20px",
          }}
        />
      </div>
    </div>
  );
}
