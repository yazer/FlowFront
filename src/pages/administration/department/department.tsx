/* eslint-disable react-hooks/exhaustive-deps */
import {
  Add,
  DeleteOutlineOutlined,
  EditOutlined,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import {
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
import { Link, useParams } from "react-router-dom";
import { fetchDeparments } from "../../../apis/administration";
import { deleteMethod, postMethod } from "../../../apis/ApiMethod";
import { DEPAARTMENT_ORG, EXPORT_DEPARTMENT } from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import { formattedDate } from "../../../utils/constants";
import CreateDepartment from "./createDepartment";
import { returnErrorToast } from "../../../utils/returnApiError";
import { useOrganization } from "../../../context/OrganizationContext";
import { ScreenKeyEnum } from "../../../utils/permissions";
import EditButton from "../../../components/Permissions/EditButton";
import DeleteButton from "../../../components/Permissions/DeleteButton";
import CreateButton from "../../../components/Permissions/CreateButton";

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

const DepartmentAdministration = () => {
  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [createCatOpen, setCreateCatOpen] = useState(false);
  const { locale } = useIntl();
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { translate } = useTranslation();
  const { sortQuery, ...sorting } = useSorting();
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const { branchId } = useParams();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminDepartment
  );

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string
  ) => {
    try {
      const res = await fetchDeparments(
        branchId,
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

  const updateList = (uuid: string, value: any) => {
    let temp = dataList.map((item) =>
      item.uuid === uuid ? { ...item, is_active: value } : item
    );
    setDataList(temp);
  };

  const toggleStatusAPI = async (uuid: string, payload: any) => {
    setLoadingStatus(uuid);
    const url = DEPAARTMENT_ORG + uuid + "/status/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_active);
      if (res.msg) {
        toast.success(res?.msg);
      }
    } catch (error: any) {
      if (typeof error === "string") {
        returnErrorToast({ error, locale });
      }
      toast.error(translate("somethingWentWrong"));
    } finally {
      setLoadingStatus(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="department" />,
      render: (value: string, row: any) => {
        return (
          <div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row.translations[locale]?.name || ""}
            </span>
          </div>
        );
      },
    },
    {
      key: "name",
      label: <FormattedMessage id="description" />,
      render: (value: string, row: any) => {
        return (
          <div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row.translations[locale]?.description || ""}
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
      hidden: !canEdit,
    },
    {
      key: "action",
      label: <FormattedMessage id="adminThAction" />,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <EditButton
            onClick={() => {
              setCreateCatOpen(true);
              setSelectedRow(row);
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
    {
      key: "action1",
      label: <FormattedMessage id="viewSection" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/organization-section/" + row.uuid}>
          <IconButton size="small" color="primary">
            <RemoveRedEyeOutlined sx={{ height: 18, width: 18 }} />
          </IconButton>
        </Link>
      ),
    },
  ];

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

  async function deleteDepartment(values: any) {
    setLoader(true);
    try {
      await deleteMethod(`${DEPAARTMENT_ORG}${values?.uuid}/`);

      fetchList(pageNumber, pageSize);
      setDeleteOpen(false);
      setSelectedRow({});

      toast.success(
        selectedRow?.translations?.[locale].name + " " + translate("deleted")
      );
    } catch (e: any) {
      console.log(e);
      toast.error(e);
    } finally {
      setLoader(false);
    }
  }

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
            <b>{selectedRow?.translations?.[locale]?.name}</b>?
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
                deleteDepartment(selectedRow);
              }}
              disabled={loader}
            >
              {translate("delete")}
            </Button>
          </Stack>
        }
      />
      {createCatOpen && (
        <CreateDepartment
          open={createCatOpen}
          handleClose={() => {
            setSelectedRow({});
            setCreateCatOpen(false);
          }}
          onSucess={() => fetchList(pageNumber, pageSize, "")}
          values={selectedRow}
        />
      )}
      <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
        minHeight={50}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        {...sorting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        Title={
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <FormattedMessage id="headingDeparmentManagement" />
            </h1>
          </div>
        }
        extraComponent={
          <CreateButton onClick={() => setCreateCatOpen(true)}>
            <FormattedMessage id="newDepartment" />
          </CreateButton>
        }
        onSearchChange={handleSearchChange}
        isExport={true}
        exportURL={EXPORT_DEPARTMENT}
      />
    </div>
  );
};

export default DepartmentAdministration;
