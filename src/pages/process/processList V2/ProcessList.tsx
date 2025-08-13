import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import RemoveRedEyeOutlined from "@mui/icons-material/RemoveRedEyeOutlined";
import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { deleteMethod, getMethod } from "../../../apis/ApiMethod";
import { listProcess } from "../../../apis/process";
import {
  EXPORT_FLOW_BUILDER,
  GET_USER_PROFILE,
  WORK_FLOW_PROCESS,
} from "../../../apis/urls";
import Chip from "../../../components/Chip/Chip";
import DataTable from "../../../components/DataTable/dataTable";
import DependentFilter, {
  typeSelectedFilters,
} from "../../../components/DependentFilter/dependenFilter";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import ProcessCreate from "../processCreate/ProcessCreate";
import "./ProcessList.css"; // Import the CSS file
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";
import EditButton from "../../../components/Permissions/EditButton";
import CreateButton from "../../../components/Permissions/CreateButton";

interface Process {
  uuid: string;
  name: string;
  description: string;
  created_by: string;
  current_runs: number;
  status: string;
}

const initialFilterValue = {
  category: "",
  department: "",
  branch: "",
  section: "",
  process: "",
};

export function ProcessList() {
  const { translate } = useTranslation();
  const { locale } = useIntl();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loader, setLoader] = useState(true);

  const { usePermissions } = useOrganization();

  const navigate = useNavigate();

  const { canDelete, canEdit, canView, canWrite } = usePermissions(
    ScreenKeyEnum.FlowBuilder
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [editFormData, setEditFormData] = useState<Process | null>(null);
  const [selectedFilter, setSelectedFilters] =
    useState<typeSelectedFilters>(initialFilterValue);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [deleteLoader, setDeleteLoader] = useState(false);

  const { branch, department, section, category } = selectedFilter;
  const { sortQuery, ...tableSorting } = useSorting();

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    // setLoader(true);
    try {
      const data = await listProcess(
        undefined,
        undefined,
        { pageNumber, pageSize },
        search
      );
      setProcesses(data.results);
      setTotalCount(data.count);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching processes:", error);
    }
  };

  useEffect(() => {
    fetchOrganizationFilterData();
  }, []);

  const fetchOrganizationFilterData = async () => {
    try {
      const res = await getMethod(GET_USER_PROFILE);

      if (res?.show_filter) {
        fetchListt(
          pageNumber,
          pageSize,
          "",
          res?.branch,
          res?.department,
          res?.section
        );
      } else {
        fetchListt(pageNumber, pageSize);
      }
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchList(page, pageSize);
    setPageNumber(page);
  };

  const handlePageSizeChange = (size: number) => {
    fetchList(1, size);
    setPageSize(size);
    setPageNumber(1); // Reset to the first page when page size changes
  };

  const handleSearchChange = (value: string) => {
    setPageNumber(1);
    setPageSize(10);
    fetchListt(1, 10, value, branch, department, section, category);
  };

  function getTextBylang(process: any, key: string) {
    if (
      process.translations &&
      process.translations[locale] &&
      process.translations[locale][key]
    ) {
      return process.translations?.[locale]?.[key];
    }
    return process[key];
  }

  const fetchWithDependentFilter = (
    branch: string,
    department: string,
    section: string,
    category: string
  ) => {
    fetchListt(1, 10, "", branch, department, section, category);
  };

  const fetchListt = async (
    pageNumber: number,
    pageSize: number,
    search?: string,
    branch?: string,
    department?: string,
    section?: string,
    category?: string
  ) => {
    // setLoader(true);
    try {
      const res = await listProcess(
        undefined,
        undefined,
        { pageNumber, pageSize },
        search?.toString(),
        {
          branch,
          department,
          section,
          category,
          sortQuery,
        }
      );
      setProcesses(res.results);
      setTotalCount(res.count);

      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchListt(pageNumber, pageSize, "", branch, department, section, category);
  }, [sortQuery]);

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="adminThProcessName" />,
      render: (value: string, row: any) => {
        const name = getTextBylang(row, "name");
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.icon_url}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {name?.charAt(0)}
            </Avatar>
            <Stack>
              <Typography variant="h5">{name}</Typography>
              <Typography
                variant="subtitle2"
                className="truncate overflow-hidden whitespace-nowrap w-50 "
                sx={{ color: "#666666" }}
              >
                {getTextBylang(row, "description").length > 50
                  ? `${getTextBylang(row, "description").substring(0, 50)}...`
                  : getTextBylang(row, "description")}
              </Typography>
            </Stack>
          </div>
        );
      },
    },
    {
      key: "category",
      label: <FormattedMessage id="adminThCategory" />,
      render: (value: any, row: any) => (
        <div className="truncate">
          {row.translations[locale].category ?? translate("notSpecified")}
        </div>
      ),
    },
    {
      key: "Status",
      label: <FormattedMessage id="status" />,
      render: (value: any, row: any) => (
        <Chip
          type={row.status === "Published" ? "success" : "info"}
          value={row?.status ?? translate("notSpecified")}
        />
      ),
    },
    {
      key: "section",
      label: <FormattedMessage id="section" />,
      render: (value: any, row: any) => (
        <Typography variant="body1" className="w-50 truncate">
          {row?.translations?.[locale]?.section ?? translate("notSpecified")}
        </Typography>
      ),
    },
    {
      key: "created_by",
      label: <FormattedMessage id="createdBy" />,
      render: (value: any, row: any) => (
        <Typography variant="body1" className="w-50 truncate">
          {value}
        </Typography>
      ),
    },
    {
      key: "action",
      // label: <FormattedMessage id="adminThAction" />,
      label: "",
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <Link to={`/process-list-v2/flow-builder/${row?.uuid}`}>
            <IconButton size="small">
              <RemoveRedEyeOutlined sx={{ height: 18, width: 18 }} />
            </IconButton>
          </Link>

          <EditButton
            onClick={() => {
              setEditFormData(row);
            }}
          ></EditButton>

          <IconButton
            size="small"
            disabled={!canDelete || row.status === "Published"}
            onClick={() => {
              if (row.status !== "Published" && canDelete) {
                setSelectedRow(row);
                setDeleteOpen(true);
              }
            }}
          >
            <DeleteOutlined sx={{ height: 18, width: 18 }} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  async function deleteProcess(uuid: string) {
    setDeleteLoader(true);
    try {
      await deleteMethod(`${WORK_FLOW_PROCESS}${uuid}/`);
      fetchList(pageNumber, pageSize);
      setDeleteOpen(false);
      toast.success(<FormattedMessage id="movetoTrashSuccessfully" />);
      setDeleteLoader(false);
    } catch (error) {
      toast.error(<FormattedMessage id="somethingWentWrong" />);
      console.log(error);
    }
  }

  return (
    <div className="space-y-4 p-4">
      <DialogCustomized
        open={deleteOpen}
        handleClose={() => {
          setSelectedRow({});
          setDeleteOpen(false);
        }}
        title={<FormattedMessage id="movetoTrash" />}
        content={
          <Typography variant="body1">
            {translate("trashQuestion")}&nbsp;
            <strong>
              {selectedRow?.translations?.[locale]?.name ||
                selectedRow?.name ||
                translate("notSpecified")}
            </strong>
          </Typography>
        }
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedRow({});
                setDeleteOpen(false);
              }}
              disabled={loader}
            >
              {translate("cancel")}
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={() => {
                // deleteDepartment(selectedRow);
                deleteProcess(selectedRow.uuid);
              }}
              disabled={loader}
            >
              {translate("movetoTrash")}
            </Button>
          </Stack>
        }
      />
      <DataTable
        columns={columns}
        loading={loader}
        data={processes}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        {...tableSorting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        filterComponent={
          <DependentFilter
            fetchWithFilter={fetchWithDependentFilter}
            selectedFilter={selectedFilter}
            setSelectedFilters={setSelectedFilters}
          />
        }
        Title={
          <div className="pb-4">
            <div className="flex flex-row gap-2 justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                <FormattedMessage id="headingFlowBuilder"></FormattedMessage>
              </h1>
            </div>
          </div>
        }
        extraComponent={
          <CreateButton
            onClick={() => navigate("/process-list/create-process")}
          >
            <FormattedMessage id="newAutomationFlow" />
          </CreateButton>
          // <Link to="/process-list/create-process">
          //   <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary">
          //     <BsPlus className="w-4 h-4" />
          //     <span>
          //       <FormattedMessage id="newAutomationFlow" />
          //     </span>
          //   </button>
          // </Link>
        }
        isExport={true}
        exportURL={EXPORT_FLOW_BUILDER}
      />
      {editFormData ? (
        <ProcessCreate
          formDataProps={editFormData}
          onClose={() => setEditFormData(null)}
          fetchList={() => fetchList(pageNumber, pageSize, "")}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProcessList;
