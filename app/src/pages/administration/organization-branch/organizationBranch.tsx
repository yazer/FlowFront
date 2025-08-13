import {
  DeleteOutlineOutlined,
  EditOutlined,
  RemoveRedEyeOutlined,
  WarningAmber,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { DeleteBranch, fetchBranches } from "../../../apis/administration";
import DataTable from "../../../components/DataTable/dataTable";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import useTranslation from "../../../hooks/useTranslation";
import CreateOrEdit from "./createOrEdit";
import { useSorting } from "../../../hooks/useSorting";
import { postMethod } from "../../../apis/ApiMethod";
import { CREATE_BRANCH, EXPORT_BRANCH } from "../../../apis/urls";
import { returnErrorToast } from "../../../utils/returnApiError";
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";
import EditButton from "../../../components/Permissions/EditButton";
import DeleteButton from "../../../components/Permissions/DeleteButton";

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
};

const OrganizationBranch = () => {
  const { locale } = useIntl();
  const { translate } = useTranslation();
  const { usePermissions } = useOrganization();

  const { canDelete, canEdit } = usePermissions(ScreenKeyEnum.AdminBranch);

  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [editClose, setEditClose] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const { sortQuery, ...sorting } = useSorting();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    try {
      const res = await fetchBranches(
        pageNumber,
        pageSize,
        search,
        sorting.sorting
      );
      setTotalCount(res.count);
      setDataList(res.results ?? []);
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
    fetchList(1, 10, value);
  };

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sortQuery]);

  const handleSwitchStatus = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    uuid: string
  ) => {
    const payload = {
      is_active: checked,
    };
    if (checked) {
      toggleStatusAPI(uuid, payload);
    } else {
      toggleStatusAPI(uuid, payload);
    }
  };

  const toggleStatusAPI = async (uuid: string, payload: any) => {
    setLoadingStatus(uuid);
    const url = CREATE_BRANCH + uuid + "/status/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_active);
      if (res.msg) {
        toast.success(res?.msg);
      }
    } catch (error: any) {
      // toast.error(error);
      returnErrorToast({ error, locale });
    } finally {
      setLoadingStatus(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="branchName" />,
      render: (value: string, row: any) => {
        return (
          <div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row?.translations?.[locale]}
            </span>
          </div>
        );
      },
    },
    {
      key: "branchContactDetails",
      label: <FormattedMessage id="branchContactDetails" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 truncate">
              {row?.email}
            </span>
            <span className="text-sm font-medium text-gray-500 truncate">
              {row?.contact_no}
            </span>
          </div>
        );
      },
    },
    {
      key: "branchAddress",
      label: <FormattedMessage id="branchAddress" />,
      render: (value: string, row: any) => {
        return (
          <>
            {row?.addresses?.[0]?.address ||
            row?.addresses?.[0]?.city ||
            row?.addresses?.[0]?.country ||
            row?.addresses?.[0]?.postal_code ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {row?.addresses?.[0]?.address} , {row?.addresses?.[0]?.city}
                </span>
                <span className="text-sm font-medium text-gray-500 truncate">
                  {row?.addresses?.[0]?.country},{" "}
                  {row?.addresses?.[0]?.postal_code}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-700 truncate">
                <FormattedMessage id="notSpecified"></FormattedMessage>
              </span>
            )}
          </>
          // <div className="flex flex-col gap-2">
          //   <span className="text-sm font-medium text-gray-700 truncate">
          //     {row?.addresses?.[0]?.address} , {row?.addresses?.[0]?.city}
          //   </span>
          //   <span className="text-sm font-medium text-gray-500 truncate">
          //     {row?.addresses?.[0]?.country}, {row?.addresses?.[0]?.postal_code}
          //   </span>
          // </div>
        );
      },
    },

    {
      key: "action",
      label: <FormattedMessage id="adminThAction" />,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <EditButton
            onClick={() => {
              handleOpen();
              setSelectedRow(row);
            }}
          />
          <DeleteButton
            onClick={() => setConfirmDelete(row?.uuid ?? null)}
          ></DeleteButton>
        </Stack>
      ),
      hidden: !canEdit && !canDelete,
    },
    {
      key: "is_active",
      label: <FormattedMessage id="status" />,
      render: (value: any, row: any) => (
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
                id={value ? "active" : "inActive"}
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
      ),
      hidden: !canEdit,
    },
    {
      key: "action_view",
      label: <FormattedMessage id="viewDepartments" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/departments/" + row.uuid}>
          <Button
            startIcon={<RemoveRedEyeOutlined />}
            className="rtl:gap-[10px]"
            sx={{ textTransform: "capitalize" }}
          >
            <FormattedMessage id="viewDepartments" />
          </Button>
        </Link>
      ),
    },

    // {
    //   key: "action",
    //   label: <FormattedMessage id="adminThAction" />,
    //   render: (_: any, row: any) => (
    //     <Link to={"/administration/organization-section/" + row.uuid}>
    //       <Button
    //         startIcon={<RemoveRedEyeOutlined />}
    //         className="rtl:gap-[10px]"
    //         sx={{ textTransform: "capitalize" }}
    //       >
    //         <FormattedMessage id="viewSection" />
    //       </Button>
    //     </Link>
    //   ),
    // },
  ];

  const handleEditClose = () => {
    setEditClose(false);
    setSelectedRow(null);
  };
  const handleOpen = () => {
    setEditClose(true);
  };

  const updateList = (uuid: string, value: any) => {
    let temp = dataList.map((item) =>
      item.uuid === uuid ? { ...item, is_active: value } : item
    );
    setDataList(temp);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await DeleteBranch(confirmDelete ?? "");
      toast.success("Successfully deleted Branch");
    } catch (error) {
      toast.error("Error while deleting Branch");
    } finally {
      fetchList(pageNumber, pageSize);
      setConfirmDelete(null);
      setDeleteLoading(false);
    }
  };
  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        {...sorting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        Title={
          <h1 className="text-2xl font-bold text-gray-900">
            <FormattedMessage id="headingBranchManagement" />
          </h1>
        }
        onSearchChange={handleSearchChange}
        extraComponent={
          <CreateOrEdit
            onSucess={() => {
              handleEditClose();
              fetchList(pageNumber, pageSize);
            }}
            open={editClose}
            handleClose={handleEditClose}
            handleOpen={handleOpen}
            initialData={selectedRow}
          />
        }
        isExport={true}
        exportURL={EXPORT_BRANCH}
      />
      <DialogCustomized
        open={!!confirmDelete}
        handleClose={() => setConfirmDelete(null)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              color="error"
              onClick={() => {
                setConfirmDelete(null);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              color="error"
              variant="contained"
              disableElevation
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {translate("delete")}
            </Button>
          </Stack>
        }
        content={
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap={1.5}
            p={2}
            borderRadius={2}
          >
            <WarningAmber color="error" sx={{ fontSize: "5rem" }} />
            <Typography variant="body1" textAlign={"center"}>
              <FormattedMessage id="areyouSureDelete"></FormattedMessage>
            </Typography>
          </Box>
        }
        title={<FormattedMessage id="DeleteBranchTitle"></FormattedMessage>}
      />
    </div>
  );
};

export default OrganizationBranch;
