import { Restore, WarningAmber } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FormattedMessage, useIntl } from "react-intl";
import { DeleteMethod, fetchTrashList } from "../../../apis/administration";
import { TRASH } from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { useSorting } from "../../../hooks/useSorting";
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
};

const OrganizationTrash = () => {
  const { locale } = useIntl();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminTrash
  );

  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [restoreLoader, setRestoreLoader] = useState(false);
  const [restoreId, setRestoreId] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { sortQuery, ...sorting } = useSorting();
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
  }, [sorting.sorting]);

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    try {
      const res = await fetchTrashList(
        pageNumber,
        pageSize,
        search,
        sorting.sorting
      );
      setTotalCount(res?.count ?? 0);
      setDataList(res?.results || []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const restoreTrash = async (restoreId: string) => {
    setRestoreLoader(true);
    try {
      const res = await DeleteMethod(TRASH, restoreId);
      fetchList(pageNumber, pageSize);
      toast.success(
        <FormattedMessage id="restoreTrashSuccessfully"></FormattedMessage>
      );
    } catch (error) {
      toast.error(<FormattedMessage id="somethingWentWrong" />);
    } finally {
      setRestoreLoader(false);
      setRestoreId("");
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="adminThProcessName" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row?.icon_url || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {row?.translations?.[locale]?.name?.charAt(0)}
            </Avatar>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row?.translations?.[locale]?.name}
            </span>
          </div>
        );
      },
    },
    // {
    //   key: "branch",
    //   label: <FormattedMessage id="submenuBranch" />,
    //   render: (value: any, row: any) => (
    //     <>{row?.translations?.[locale]?.branch}</>
    //   ),
    // },
    // {
    //   key: "department",
    //   label: <FormattedMessage id="department" />,
    //   render: (value: any, row: any) => (
    //     <>{row?.translations?.[locale]?.department}</>
    //   ),
    // },
    {
      key: "section",
      label: <FormattedMessage id="section" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.section}</>
      ),
    },
    {
      key: "action",
      label: <FormattedMessage id="adminThAction" />,
      render: (_: any, row: any) => (
        <IconButton
          // startIcon={<RemoveRedEyeOutlined />}
          // className="rtl:gap-[10px]"
          // sx={{ textTransform: "capitalize" }}
          onClick={() => {
            if (canEdit) {
              setRestoreId(row?.uuid ?? "");
            }
          }}
          disabled={!canEdit}
        >
          <Restore />
          {/* <FormattedMessage id="view" /> */}
        </IconButton>
      ),
    },
    // {
    //   key: "action",
    //   label: <FormattedMessage id="adminThAction" />,
    //   render: (_: any, row: any) => (
    //     <Button
    //       startIcon={<RemoveRedEyeOutlined />}
    //       className="rtl:gap-[10px]"
    //       sx={{ textTransform: "capitalize" }}
    //       onClick={() => setShowVersions(true)}
    //     >
    //       <FormattedMessage id="view" />
    //     </Button>
    //     // <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
    //     //   <BsEye className="w-4 h-4" />
    //     //   <span>View</span>
    //     // </button>
    //   ),
    // },
  ];

  return (
    <>
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
            <div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    <FormattedMessage id="trash"></FormattedMessage>
                  </h1>
                  {/* <p className="mt-1 text-sm text-gray-500">
                  <FormattedMessage id="subHeadingProcessManagement"></FormattedMessage>
                </p> */}
                </div>
              </div>
              {/* <DependentFilter fetchWithFilter={fetchWithDependentFilter} /> */}
            </div>
          }
          // filterComponent={
          //   <DependentFilter
          //     fetchWithFilter={fetchWithDependentFilter}
          //     selectedFilter={selectedFilter}
          //     setSelectedFilters={setSelectedFilters}
          //   />
          // }
          onSearchChange={handleSearchChange}
        ></DataTable>
      </div>

      <DialogCustomized
        open={!!restoreId}
        handleClose={() => {
          setRestoreId("");
        }}
        title={<FormattedMessage id="restore" />}
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
            <WarningAmber color="info" sx={{ fontSize: "3rem" }} />
            <Typography variant="body1">
              <FormattedMessage id="restoreQuestion"></FormattedMessage>
            </Typography>
          </Box>
        }
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setRestoreId("");
              }}
              disabled={restoreLoader}
            >
              <FormattedMessage id="cancel"></FormattedMessage>
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={() => {
                restoreTrash(restoreId);
              }}
              disabled={restoreLoader}
            >
              <FormattedMessage id="restore"></FormattedMessage>
            </Button>
          </Stack>
        }
      />
    </>
  );
};

export default OrganizationTrash;
