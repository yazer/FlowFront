import {
  Logout as LogoutIcon,
  NotificationsOutlined,
} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Badge,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Outlet, useNavigate } from "react-router";
import { getMethod, postMethod } from "../apis/ApiMethod";
import { fetchOrganization } from "../apis/organization";
import {
  GET_TIME_ZONE,
  GET_USER_PROFILE,
  POST_PAGE_PREFERENCE,
  UPDATE_TIME_ZONE,
} from "../apis/urls";
import LangDropDown from "../components/Dropdown/LangDropDown";
import SideMenu from "../components/SideMenu/SideMenu";
import AIworkFlowIndex from "../containers/aiworkflow/AIworkFlowIndex";
import useGlobalContext from "../context/useGlobalContext";
import toast from "react-hot-toast";
import { pagePreferencesList } from "../utils/constants";
import { useOrganization } from "../context/OrganizationContext";

const MainLayout: React.FC<{
  locale: string;
  handleLocaleChange: (updatedLocale: string) => void;
}> = ({ locale, handleLocaleChange }) => {
  const { userFilterData } = useOrganization();
  console.log(userFilterData);

  const [anchorEl, setAnchor] = useState<null | HTMLElement>(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [organizationData, setOrganizationData] = useState<any>({});
  const { aiSideBox } = useGlobalContext();
  const theme = useTheme();

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchor(null);
  };

  const handleOnClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleLocaleChange(e.target.value);
  };

  const profileImg = localStorage.getItem("profile_img");
  const userDetails: any =
    JSON.parse(localStorage.getItem("user_details") || "{}")?.[locale] || null;

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const res = await fetchOrganization();
      setOrganizationData(res);
    } catch (err) {}
  };

  return (
    <div
      className="w-screen h-screen flex flex-col"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      {/* Header */}
      <header>
        <div
          className="h-16 border-b-[1px] border-gray-300 flex justify-between px-4"
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            color: theme.palette.primary.contrastText,
          }}
        >
          <div className={`flex items-center`}>
            {organizationData?.logo && (
              <img
                src={organizationData?.logo}
                alt="Company Logo"
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "10px",
                  objectFit: "contain",
                }}
              />
            )}
            <div className="text-md text-gray-600 mb-1 font-semibold">
              {organizationData?.translations?.[locale]}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* <button
              className="ai-workflow-button bg-white font-semibold py-1 px-4 rounded shadow"
              onClick={() => toggleAisideBox((state: boolean) => !state)}
            >
              <FormattedMessage id="aiWorkflowBuilder" />
            </button> */}
            <LangDropDown handleOnClick={handleOnClick} value={locale} />
            <Badge color="secondary" variant="dot">
              <NotificationsOutlined
                sx={{ color: theme.palette.primary.main }}
              />
            </Badge>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={anchorEl ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
              >
                <Avatar
                  src={profileImg ?? undefined}
                  sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                >
                  {userDetails?.first_name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <MenuPopup
              handleMenuClose={handleMenuClose}
              anchorEl={anchorEl}
              userName={`${userDetails?.first_name}  ${userDetails?.last_name}`}
              userDesignation={userDetails?.job_title}
            />
          </div>
        </div>
      </header>

      <div className="h-full flex">
        <SideMenu toggleMenu={toggleMenu} setToggleMenu={setToggleMenu} />
        <main
          className="bg-[#f5f5f5]"
          style={{
            width: `calc(100vw - ${!toggleMenu ? "250px" : "83px"} - ${
              aiSideBox ? "410px" : "0px"
            })`,
            overflowY: "auto",
            height: "calc(100vh - 44px)",
          }}
        >
          <Outlet />
        </main>
        <AIworkFlowIndex />
      </div>
    </div>
  );
};

export default MainLayout;

type MenuPopupProps = {
  handleMenuClose: () => void;
  anchorEl: null | HTMLElement;
  userName: string | React.ReactElement;
  userDesignation: string | React.ReactElement;
};

function MenuPopup({
  handleMenuClose,
  anchorEl,
  userName,
  userDesignation,
}: MenuPopupProps) {
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const [loadTimeZone, setLoadTimeZone] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [timezoneSearch, setTimezoneSearch] = useState("");
  const [openTimezone, setOpenTimezone] = useState(false);
  const [timezone, setTimezone] = useState<{ id: number; name: string }>({
    id: 0,
    name: "Timezone",
  });

  const [pagePreference, setPagePreference] = useState<any>({});

  const [landingSearch, setLandingSearch] = useState("");
  const [openLandingScreen, setOpenLandingScreen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMethod(GET_USER_PROFILE);

        setTimezone({
          id: data?.timezone ?? 0,
          name: data?.timezone_name ?? "Timezone",
        });
        setPagePreference({
          route: data?.redirect_url,
          name: pagePreferencesList?.find(
            (item) => data?.redirect_url === item?.route
          )?.name,
        });
      } catch (error) {
        console.error("Error While getting user profile", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadTimeZone(true);
      try {
        const res = await getMethod(
          `${GET_TIME_ZONE}?page=1&page_size=20&search=${timezoneSearch}`
        );

        setOptions(res.results || []);
      } catch (err) {
        console.error("Failed to fetch organization data:", err);
      } finally {
        setLoadTimeZone(false);
      }
    })();
  }, [timezoneSearch]);

  async function setTimeZone(value: number) {
    try {
      await postMethod(`${UPDATE_TIME_ZONE}${value}/`, {});
      toast.success("Timezone updated successfully");
    } catch (error) {
      toast.error("Failed to update timezone");
    }
  }

  async function setLandingScreen(value: number) {
    try {
      await postMethod(`${POST_PAGE_PREFERENCE}`, { redirect_url: value });
      toast.success("Page preference updated successfully");
    } catch (error) {
      toast.error("Failed to update Page preference");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("designation");
    localStorage.removeItem("profile_img");
    navigate("/auth/login");
  }

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          minWidth: 250,
          padding: "10px",
        },
      }}
    >
      <div style={{ marginLeft: 10 }} className="p-1">
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userDesignation}
        </Typography>
      </div>

      <Stack padding={1}>
        <Typography variant="subtitle1" textTransform={"capitalize"}>
          <FormattedMessage id="pagePreference"></FormattedMessage>
        </Typography>
        <Autocomplete
          fullWidth
          open={openLandingScreen}
          onOpen={() => setOpenLandingScreen(true)}
          onClose={() => setOpenLandingScreen(false)}
          onChange={(event, newValue) => {
            setLandingScreen(newValue?.route);
            setPagePreference(newValue);
          }}
          clearIcon={false}
          value={pagePreference}
          isOptionEqualToValue={(option, value) => option.route === value.route}
          getOptionLabel={(option) => option.name}
          options={pagePreferencesList}
          size={"small"}
          loading={loadTimeZone}
          renderInput={(params) => (
            <TextField
              {...params}
              // label="TimeZone"
              onChange={(e) => {
                setOpenLandingScreen(true);
                setLandingSearch(e.target.value);
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadTimeZone ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Stack>

      <Stack padding={1}>
        <Typography variant="subtitle1" textTransform={"capitalize"}>
          <FormattedMessage id="timeZone"></FormattedMessage>
        </Typography>
        <Autocomplete
          fullWidth
          open={openTimezone}
          onOpen={() => setOpenTimezone(true)}
          onClose={() => setOpenTimezone(false)}
          onChange={(event, newValue) => {
            setTimeZone(newValue?.id);
          }}
          clearIcon={false}
          value={timezone}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          options={options}
          size={"small"}
          loading={loadTimeZone}
          renderInput={(params) => (
            <TextField
              {...params}
              // label="TimeZone"
              onChange={(e) => {
                setOpenTimezone(true);
                setTimezoneSearch(e.target.value);
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadTimeZone ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Stack>
      <Divider />
      <MenuItem onClick={logout}>
        <LogoutIcon
          sx={{ color: "error.main", fontSize: 20, marginRight: 1 }}
        />
        <Typography variant="body2">
          <FormattedMessage id="logout" />
        </Typography>
      </MenuItem>
    </Popover>
  );
}
