import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { fetchStaffs } from "../../../apis/administration";
import Chip from "../../../components/Chip/Chip";
import DataTable from "../../../components/DataTable/dataTable";
import { useSorting } from "../../../hooks/useSorting";
import {
  DeleteOutlined,
  EditOutlined,
  WarningAmber,
} from "@mui/icons-material";
import CreateOrEditUser from "./createOrEdit";
import { BsPlus } from "react-icons/bs";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import useTranslation from "../../../hooks/useTranslation";
import toast from "react-hot-toast";
import { deleteMethod } from "../../../apis/ApiMethod";
import {
  DELETE_STAFF,
  EXPORT_USER,
  GET_STAFF_ORGANIZATION,
} from "../../../apis/urls";
import { returnErrorToast } from "../../../utils/returnApiError";
import CreateButton from "../../../components/Permissions/CreateButton";
import EditButton from "../../../components/Permissions/EditButton";
import DeleteButton from "../../../components/Permissions/DeleteButton";
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";

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

const StaffAdministration = () => {
  const { locale } = useIntl();

  const { translate } = useTranslation();
  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const { sortQuery, ...sorting } = useSorting();

  const [editFormData, setEditFormData] = useState<ObjType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit } = usePermissions(ScreenKeyEnum.AdminStaff);

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    try {
      const res = await fetchStaffs(
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

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="name" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.icon_url || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {value?.charAt(0)}
            </Avatar>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row?.translations?.[locale]?.first_name}{" "}
              {row?.translations?.[locale]?.last_name}
            </span>
          </div>
        );
      },
    },
    {
      key: "designation",
      label: <FormattedMessage id="designation" />,
      render: (value: any, row: any) =>
        row?.translations?.[locale]?.job_title ? (
          row?.translations?.[locale]?.job_title
        ) : (
          <FormattedMessage id="notSpecified"></FormattedMessage>
        ),
    },
    {
      key: "email",
      label: <FormattedMessage id="email" />,
      render: (value: any, row: any) => value,
    },
    {
      key: "phone_number",
      label: <FormattedMessage id="contactNo" />,
      render: (value: any, row: any) => value,
    },
    {
      key: "section",
      label: <FormattedMessage id="section" />,
      render: (value: any, row: any) =>
        row?.translations?.[locale]?.section_name ? (
          row?.translations?.[locale]?.section_name
        ) : (
          <FormattedMessage id="notSpecified"></FormattedMessage>
        ),
    },
    {
      key: "is_active",
      label: <FormattedMessage id="status" />,
      render: (value: any) => (
        <Chip
          type={value ? "info" : "error"}
          value={
            value ? (
              <FormattedMessage id={"active"}></FormattedMessage>
            ) : (
              <FormattedMessage id={"inActive"}></FormattedMessage>
            )
          }
        />
      ),
    },
    {
      key: "action",
      // label: <FormattedMessage id="adminThAction" />,
      label: "",
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <EditButton
            onClick={() => {
              setEditFormData(row);
              setFormOpen(true);
            }}
          />
          <DeleteButton
            onClick={() => {
              if (row.status !== "Published") {
                setConfirmDelete(row?.uuid);
              }
            }}
          />
        </Stack>
      ),
      hidden: !canEdit && !canDelete,
    },
  ];

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

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
    fetchList(1, 10, value);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await deleteMethod(DELETE_STAFF + confirmDelete + "/");
      console.log(res);
      toast.success(res);
    } catch (error: any) {
      returnErrorToast({ error, locale });
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
        onSearchChange={handleSearchChange}
        Title={
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <FormattedMessage id="submenuUserList" />
            </h1>
          </div>
        }
        extraComponent={
          <CreateButton onClick={() => setFormOpen(true)}>
            <FormattedMessage id="newUser" />
          </CreateButton>
        }
        isExport={true}
        exportURL={EXPORT_USER}
      ></DataTable>

      {formOpen && (
        <CreateOrEditUser
          formDataProps={editFormData}
          onClose={() => {
            setFormOpen(false);
            setEditFormData(null);
          }}
          fetchList={() => fetchList(pageNumber, pageSize, "")}
        />
      )}

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

export default StaffAdministration;
