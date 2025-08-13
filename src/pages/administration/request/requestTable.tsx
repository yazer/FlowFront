import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { fetchAdminRequestList } from "../../../apis/administration";
import { getMethod, postMethod } from "../../../apis/ApiMethod";
import {
  EXPORT_REQUEST,
  GET_USER_PROFILE,
  REQUEST_PAUSE,
} from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import { Button, FormControlLabel, Switch, Typography } from "@mui/material";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import { BiPlus } from "react-icons/bi";
import toast from "react-hot-toast";
import Chip from "../../../components/Chip/Chip";
import DependentFilter, {
  typeSelectedFilters,
} from "../../../components/DependentFilter/dependenFilter";
import { returnErrorToast } from "../../../utils/returnApiError";
import { ScreenKeyEnum } from "../../../utils/permissions";
import { useOrganization } from "../../../context/OrganizationContext";

type ObjType = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  remarks: string;
  icon: string | null;
  is_active: boolean;
  on_confirmation: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  category: number;
  request_id: string;
};

const initialFilterValue = {
  category: "",
  department: "",
  branch: "",
  section: "",
  process: "",
};

const RequestAdministration = () => {
  const { locale } = useIntl();

  const { translate } = useTranslation();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminRequest
  );
  const [requestList, setRequestList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<null | string>(null);

  const [selectedFilter, setSelectedFilters] =
    useState<typeSelectedFilters>(initialFilterValue);

  const { branch, department, section, category, process } = selectedFilter;
  const { sortQuery, ...sorting } = useSorting();

  const fetchList = async (
    page: number,
    pageSize: number,
    search?: string,
    branch?: string,
    department?: string,
    section?: string,
    category?: string,
    process?: string
  ) => {
    try {
      const res = await fetchAdminRequestList(
        page,
        pageSize,
        search,
        branch,
        department,
        section,
        category,
        process,
        sorting.sorting
      );
      setTotalCount(res.count);
      setRequestList(res ?? []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    fetchList(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    fetchList(1, size);

    setPageSize(size);
    setPageNumber(1); // Reset to the first page when page size changes
  };

  const handleSearchChange = (value: string) => {
    setPageNumber(1);
    setPageSize(10);
    fetchList(1, 10, value, branch, department, section, category, process);
  };

  useEffect(() => {
    fetchOrganizationFilterData();
  }, [sorting.sorting]);

  const fetchOrganizationFilterData = async () => {
    try {
      const res = await getMethod(GET_USER_PROFILE);

      if (res?.show_filter) {
        fetchList(
          pageNumber,
          pageSize,
          "",
          res?.branch,
          res?.department,
          res?.section
        );
      } else {
        fetchList(pageNumber, pageSize);
      }
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  const fetchWithDependentFilter = (
    branch?: string,
    department?: string,
    section?: string,
    category?: string,
    process?: string
  ) => {
    fetchList(1, 10, "", branch, department, section, category, process);
  };

  const updateList = (uuid: string, value: any) => {
    debugger;
    let temp = requestList.map((item) =>
      item.uuid === uuid ? { ...item, is_paused: value } : item
    );
    setRequestList(temp);
  };

  const toggleStatusAPI = async (uuid: string, payload: any) => {
    setLoadingStatus(uuid);
    const url = REQUEST_PAUSE + uuid + "/pause/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_paused);
      toast.success(res?.msg);
    } catch (error: any) {
      if (typeof error === "string") {
        returnErrorToast({ error, locale });
      } else {
        toast.error(
          <FormattedMessage id="somethingWentWrong"></FormattedMessage>
        );
      }
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleSwitchStatus = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    uuid: string
  ) => {
    const payload = {
      is_paused: checked,
    };
    if (checked) {
      toggleStatusAPI(uuid, payload);
    } else {
      toggleStatusAPI(uuid, payload);
    }
  };

  const columns = [
    { key: "request_id", label: <FormattedMessage id="adminThRequestId" /> },
    {
      key: "created_by",
      label: <FormattedMessage id="adminThCreatedBy" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.created_by}</>
      ),
    },
    {
      key: "start_date",
      label: <FormattedMessage id="adminThCreatedDate" />,
    },
    {
      key: "process",
      label: <FormattedMessage id="processName" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.process_name}</>
      ),
    },
    {
      key: "is_paused",
      label: <FormattedMessage id="status" />,
      render: (value: any, row: any) => (
        <>
          {row?.is_completed ? (
            <Chip
              type={"success"}
              value={<FormattedMessage id="completed"></FormattedMessage>}
            />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  onChange={(e, checked) =>
                    handleSwitchStatus(e, checked, row?.uuid)
                  }
                  checked={value}
                  disabled={loadingStatus === row?.uuid}
                />
              }
              label={
                <Typography variant="subtitle1" textTransform={"capitalize"}>
                  <FormattedMessage
                    id={value ? "paused" : "inprogress"}
                  ></FormattedMessage>
                </Typography>
              }
              style={{
                textTransform: "capitalize",
                color: "#212121",
                fontSize: "12px",
                fontWeight: "600",
              }}
            />
          )}
        </>
      ),
      hidden: !canEdit
    },
    {
      key: "section",
      label: <FormattedMessage id="section" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.section}</>
      ),
    },
    {
      key: "category",
      label: <FormattedMessage id="adminThCategory" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.category}</>
      ),
    },
    {
      key: "action",
      label: (
        <div className="flex items-center justify-center">
          <FormattedMessage id="viewTracks" />
        </div>
      ),
      render: (_: any, row: any) => (
        <Link
          to={"/administration/requests/tracks/" + row?.uuid}
          className="flex items-center justify-center"
        >
          <IconButton>
            <RemoveRedEyeOutlined />
            {/* <FormattedMessage id="view" /> */}
          </IconButton>
        </Link>
      ),
    },
    {
      key: "action",
      label: (
        <div className="flex items-center justify-center">
          <FormattedMessage id="viewStatus" />
        </div>
      ),
      render: (_: any, row: any) => (
        <Link
          to={"/administration/requests/" + row?.uuid}
          className="flex items-center justify-center"
        >
          <IconButton>
            <RemoveRedEyeOutlined />
            {/* <FormattedMessage id="view" /> */}
          </IconButton>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={requestList}
        loading={loader}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        {...sorting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        Title={
          <div className="flex items-center justify-between pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <FormattedMessage id="headingRequestManagement"></FormattedMessage>
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                <FormattedMessage id="subHeadingRequestManagement"></FormattedMessage>
              </p>
            </div>
          </div>
        }
        filterComponent={
          <DependentFilter
            fetchWithFilter={fetchWithDependentFilter}
            selectedFilter={selectedFilter}
            setSelectedFilters={setSelectedFilters}
            isProcessFilter={true}
          />
        }
        isExport={true}
        exportURL={EXPORT_REQUEST}
      ></DataTable>
    </div>
  );
};

export default RequestAdministration;
