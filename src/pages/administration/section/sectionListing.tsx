import {
  Button,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { fetchSectionDetails } from "../../../apis/administration";
import DataTable from "../../../components/DataTable/dataTable";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import { formattedDate } from "../../../utils/constants";
import CreateOrEditSection from "./CreateOrEditSection";
import { deleteMethod, postMethod } from "../../../apis/ApiMethod";
import toast from "react-hot-toast";
import { CREATE_SECTION, EXPORT_SECTION } from "../../../apis/urls";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
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

const OrganizationSection = () => {
  const { locale } = useIntl();
  const { departmentId } = useParams();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminSection
  );

  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { translate } = useTranslation();

  const [selectedRow, setSelectedRow] = useState<any>({});
  const { sortQuery, ...sorting } = useSorting();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    try {
      const res = await fetchSectionDetails(
        departmentId,
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

  const updateList = (uuid: string, value: any) => {
    let temp = dataList.map((item) =>
      item.uuid === uuid ? { ...item, is_active: value } : item
    );
    setDataList(temp);
  };

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

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
    const url = CREATE_SECTION + uuid + "/status/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_active);
      if (res.msg) {
        toast.success(res?.msg);
      }
    } catch (error: any) {
      returnErrorToast({ error, locale });
      // toast.error(error);
    } finally {
      setLoadingStatus(null);
    }
  };

  async function deleteSection(row: any) {
    try {
      const data = await deleteMethod(CREATE_SECTION + row?.uuid + "/delete/");
      toast.success(data.msg || "Section deleted successfully");
      fetchList(pageNumber, pageSize);
      setDeleteOpen(false);
    } catch (e: any) {
      console.error("Error deleting section:", e);
      returnErrorToast({ error: e, locale });
    }
  }

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="sectionName" />,
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
      key: "created_at",
      label: <FormattedMessage id="adminThCreatedDate" />,
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
      hidden: !canEdit
    },
    {
      key: "action",
      label: <FormattedMessage id="adminThAction" />,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <EditButton
            onClick={() => {
              setSelectedRow(row);
              setOpen(true);
            }}
          />
          <DeleteButton
            onClick={() => {
              setSelectedRow(row);
              setDeleteOpen(true);
            }}
          />
        </Stack>
      ),
      hidden: !canEdit && !canDelete,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DialogCustomized
        open={deleteOpen}
        handleClose={() => {
          setSelectedRow({});
          setDeleteOpen(false);
        }}
        title={<FormattedMessage id="delete" />}
        content={
          <Typography variant="body1">
            {translate("deleteQuestion")}&nbsp;
            {/* @ts-ignore */}
            <b>{selectedRow?.translations?.[locale]}</b>?
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
                deleteSection(selectedRow);
              }}
              disabled={loader}
            >
              {translate("delete")}
            </Button>
          </Stack>
        }
      />

      <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        minHeight={150}
        extraComponent={
          <CreateOrEditSection
            onSucess={function () {}}
            value={selectedRow}
            setSelectedRow={setSelectedRow}
            setOpen={setOpen}
            open={open}
            fetchList={() => fetchList(pageNumber, pageSize, "")}
          />
        }
        {...sorting}
        Title={
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <FormattedMessage id="headingSectionManagement" />
            </h1>
          </div>
        }
        onSearchChange={handleSearchChange}
        isExport={true}
        exportURL={EXPORT_SECTION}
      />
    </div>
  );
};

export default OrganizationSection;
