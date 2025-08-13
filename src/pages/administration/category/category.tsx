import {
  DeleteOutlineOutlined,
  EditOutlined,
  WarningAmber,
} from "@mui/icons-material";
import {
  Avatar,
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
import { DeleteMethod, fetchCategories } from "../../../apis/administration";
import { CREATE_CATEGORY, EXPORT_CATEGORY } from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import { formattedDate } from "../../../utils/constants";
import CreateOrEdit from "./createOrEdit";
import { postMethod } from "../../../apis/ApiMethod";
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

const CategoryAdministration = () => {
  const { locale } = useIntl();
  const { translate } = useTranslation();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminCategory
  );

  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [editClose, setEditClose] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { sortQuery, ...sorting } = useSorting();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const updateList = (uuid: string, value: any) => {
    let temp = dataList.map((item) =>
      item.uuid === uuid ? { ...item, is_active: value } : item
    );
    setDataList(temp);
  };

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    fetchList(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    fetchList(1, size);
    setPageSize(size);
    setPageNumber(1); // Reset to the first page when page size changes
  };

  const handleEditClose = () => {
    setEditClose(false);
    setSelectedRow(null);
  };
  const handleOpen = () => {
    setEditClose(true);
  };

  const fetchList = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ) => {
    try {
      const res = await fetchCategories(
        pageNumber,
        pageSize,
        search,
        sorting.sorting
      );
      setDataList(res.results ?? []);
      setTotalCount(res.count);

      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setPageNumber(1);
    setPageSize(10);
    fetchList(1, 10, value);
  };

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
    const url = CREATE_CATEGORY + uuid + "/status/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_active);
      if (res.msg) {
        toast.success(res?.msg);
      }
    } catch (error: any) {
      toast.error(
        <FormattedMessage id="somethingWentWrong"></FormattedMessage>
      );
    } finally {
      setLoadingStatus(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="category" />,
      render: (value: string, row: any) => {
        return (
          <div>
            <div className="flex items-center gap-3">
              <Avatar
                src={row.icon_url || ""}
                sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
              >
                {value?.charAt(0)}
              </Avatar>
              <span className="text-sm font-medium text-gray-700 truncate">
                {row?.translations?.[locale]?.name}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "created_by",
      label: <FormattedMessage id="adminThCreatedBy" />,
      render: (value: any) => value?.[locale]?.label,
    },
    {
      key: "created_at",
      label: <FormattedMessage id="adminThCreatedDate" />,
      render: (value: any) => formattedDate(value),
    },
    {
      key: "updated_at",
      label: <FormattedMessage id="adminThLastUpdated" />,
      render: (value: any) => formattedDate(value),
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
      key: "action",
      label: <FormattedMessage id="adminThAction" />,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <EditButton
            onClick={() => {
              handleOpen();
              setSelectedRow(row);
            }}
          ></EditButton>

          <DeleteButton
            onClick={() => setConfirmDelete(row?.uuid ?? null)}
          ></DeleteButton>
        </Stack>
      ),
      hidden: !canEdit && !canDelete,
    },
  ];

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await DeleteMethod(CREATE_CATEGORY, confirmDelete ?? "");
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
      {/* {createCatOpen && (
        <CreateCategory
          open={createCatOpen}
          handleClose={() => setCreateCatOpen(false)}
          onSucess={() => fetchList()}
        />
      )} */}
      <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
        pagination={true}
        pageSize={pageSize}
        {...sorting}
        pageNumber={pageNumber}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        Title={
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <FormattedMessage id="headingCategoryManagement" />
            </h1>
          </div>
        }
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
        onSearchChange={handleSearchChange}
        isExport={true}
        exportURL={EXPORT_CATEGORY}
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
        title={<FormattedMessage id="DeleteCategoryTitle"></FormattedMessage>}
      />
    </div>
  );
};

export default CategoryAdministration;
