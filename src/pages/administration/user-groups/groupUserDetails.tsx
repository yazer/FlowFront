import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router";
import { deleteMethod, getMethod, postMethod } from "../../../apis/ApiMethod";
import {
  ADD_STAFF_TO_GROUP,
  DELETE_STAFF,
  GET_GROUPS,
  GET_GROUPS_USERS,
  GET_UNASSIGNED_STAFF,
  REMOVE_STAFF_FROM_GROUP,
} from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import { useSorting } from "../../../hooks/useSorting";
import { DeleteOutlined, WarningAmber } from "@mui/icons-material";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import useTranslation from "../../../hooks/useTranslation";
import toast from "react-hot-toast";
import { returnErrorToast } from "../../../utils/returnApiError";
import { BsPlus } from "react-icons/bs";
import MultiSelectDropdownNode from "../../workflow V2/MultiSelectDropDownNode";
import MultiSelectField from "../../../components/FormElements/components/MultiSelectDropdown";
import CreateButton from "../../../components/Permissions/CreateButton";
import DeleteButton from "../../../components/Permissions/DeleteButton";
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";

const GroupUsers = () => {
  const { groupId } = useParams();

  const { usePermissions } = useOrganization();

  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminGroup
  );

  const [details, setDetails] = useState<any>({});
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const { locale } = useIntl();
  const { sortQuery, ...sorting } = useSorting();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { translate } = useTranslation();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [unassignedStaffs, setUnassignedStaffs] = useState<any[]>([]);
  const [unassignedStaffLoader, setUnassignedStaffLoader] =
    useState<boolean>(false);
  const [addUserLoading, setAddUserLoading] = useState<boolean>(false);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchGroupDetail = async () => {
    try {
      const res = await getMethod(GET_GROUPS + groupId);
      setTotalCount(res?.count ?? 0);
      setDetails(res || {});
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const fetchUnassingedStaff = async () => {
    setUnassignedStaffLoader(true);
    try {
      const res = await getMethod(
        GET_UNASSIGNED_STAFF + groupId + "/unassigned-staff/ "
      );
      setUnassignedStaffs(res);
    } catch (err) {
    } finally {
      setUnassignedStaffLoader(false);
    }
  };

  const fetchList = async (
    pageSize: number,
    pageNumber: number,
    search?: string
  ) => {
    const url = new URL(GET_GROUPS_USERS + groupId);

    const params = new URLSearchParams({
      page: pageNumber.toString(),
      page_size: pageSize.toString(),
      search: search ?? "",
      lang: search ? localStorage.getItem("locale") ?? "" : "",
      ...sorting.sorting,
    });
    url.search = params.toString();

    try {
      const res = await getMethod(url);
      setData(res || []);
      setLoader(false);
    } catch (err) {
      console.error("Error fetching process versions:", err);
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

  // useEffect(() => {
  //   fetchGroupDetail();
  // }, []);

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await postMethod(
        REMOVE_STAFF_FROM_GROUP + confirmDelete + "/remove-group/",
        { group: groupId }
      );
      console.log(res);
      toast.success(res?.success);
    } catch (error: any) {
      returnErrorToast({ error, locale });
    } finally {
      fetchList(pageNumber, pageSize);
      setConfirmDelete(null);
      setDeleteLoading(false);
    }
  };

  const handleAddUsers = async () => {
    setAddUserLoading(true);

    try {
      const res = await postMethod(
        ADD_STAFF_TO_GROUP + groupId + "/add-group/",
        {
          staff_ids: selectedUsers,
        }
      );
      toast.success(res?.success);
    } catch (error) {
      returnErrorToast({ error, locale });
    } finally {
      setFormOpen(false);
      fetchList(pageNumber, pageSize);
      setSelectedUsers([]);
      setAddUserLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="adminThName" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row?.icon_url || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {row?.translations?.[locale]?.name?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 truncate">
                {row?.translations?.[locale]?.name}
              </span>
              {row?.is_active ? (
                <span className="text-xs text-green-600 font-semibold">
                  Active
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: <FormattedMessage id="branchMail" />,
      render: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-gray-700">{value}</span>
        );
      },
    },
    {
      key: "action",
      // label: <FormattedMessage id="adminThAction" />,
      label: "",
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <DeleteButton
            onClick={() => {
              setConfirmDelete(row?.uuid);
            }}
          />
        </Stack>
      ),
      hidden: !canDelete,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={data && Array.isArray(data) ? data : []}
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
                <FormattedMessage id="groupUsers"></FormattedMessage>
                {/* <span className="text-primary">{processDetails?.name}</span> */}
              </h1>
            </div>
          </div>
        }
        extraComponent={
          <CreateButton
            onClick={() => {
              setFormOpen(true);
              fetchUnassingedStaff();
            }}
          >
            <FormattedMessage id="addStaffs" />
          </CreateButton>
        }
      ></DataTable>

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
              <FormattedMessage id="areyouSureRemoveUserFromGroup"></FormattedMessage>
            </Typography>
          </Box>
        }
        title={<FormattedMessage id="deleteUsersGroup"></FormattedMessage>}
      />

      <DialogCustomized
        open={formOpen}
        handleClose={() => {
          setFormOpen(false);
          setSelectedUsers([]);
        }}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                setFormOpen(false);
                setSelectedUsers([]);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleAddUsers}
              disabled={addUserLoading}
            >
              {translate("submit")}
            </Button>
          </Stack>
        }
        content={
          <>
            {unassignedStaffLoader ? (
              <div className="flex items-center justify-center w-full h-[100px]">
                <CircularProgress />
              </div>
            ) : unassignedStaffs.length > 0 ? (
              <Box
                display="flex"
                flexDirection={"column"}
                alignItems="center"
                justifyContent={"center"}
                gap={1.5}
                p={2}
                borderRadius={2}
              >
                <MultiSelectField
                  label={
                    <FormattedMessage id="selectStaffs"></FormattedMessage>
                  }
                  options={
                    unassignedStaffs.map((item: any) => ({
                      value: item?.uuid,
                      label:
                        item?.translations?.[locale]?.first_name +
                        " " +
                        item?.translations?.[locale]?.last_name,
                    })) || []
                  }
                  value={
                    selectedUsers && Array.isArray(selectedUsers)
                      ? selectedUsers
                      : []
                  }
                  onChange={(e: any) => setSelectedUsers(e.target.value)}
                  name={"selectedUsers"}
                />
              </Box>
            ) : (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fdf4f4",
                  border: "1px solid #e0c4c4",
                  borderRadius: "6px",
                  color: "#a33",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                <FormattedMessage
                  id="noStaffs"
                  defaultMessage="No fields available to add conditions."
                />
              </div>
            )}
          </>
        }
        title={<FormattedMessage id="addUsersGroup"></FormattedMessage>}
      />
    </div>
  );
};

export default GroupUsers;
