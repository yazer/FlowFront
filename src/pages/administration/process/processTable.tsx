import { RemoveRedEyeOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiPlus, BiTrash } from "react-icons/bi";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import {
  deleteMethod,
  getMethod,
  postMethod,
  postMethodWithFormData,
} from "../../../apis/ApiMethod";
import {
  ADD_FILES_PROCESS,
  DELETE_PROCESS_DOCS,
  EXPORT_PROCESS_ADMIN,
  GET_PROCESS_DOCS,
  GET_USER_PROFILE,
  PROCESS_DEACTIVATE,
} from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import DependentFilter, {
  typeSelectedFilters,
} from "../../../components/DependentFilter/dependenFilter";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import FileUpload from "../../../components/FormElements/components/FileUpload";
import { HiDocumentRemove } from "react-icons/hi";

import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import { formattedDate } from "../../../utils/constants";
import { fetchAdminProcessList } from "../../../apis/administration";
import { convertToObject } from "typescript";
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
  translations: any;
};

const initialFilterValue = {
  category: "",
  department: "",
  branch: "",
  section: "",
};

// const fieldInitialValue = [{ name: "", file: null }];

const getInitialFields = () => [{ name: "", file: null }];

const ProcessAdministration = () => {
  const { locale } = useIntl();

  const { usePermissions } = useOrganization();
  const { canDelete, canEdit, canWrite } = usePermissions(
    ScreenKeyEnum.AdminProcess
  );

  const [processList, setProcessList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [loadingOpenFiles, setLoadingOpenFiles] = useState(false);
  const [processGetLoading, setProcessGetLoading] = useState(false);
  const [fields, setFields] = useState<{ name: string; file: File | null }[]>(
    getInitialFields()
  );

  const { translate } = useTranslation();

  const [openFiles, setOpenFiles] = useState<ObjType | null>(null);

  const [selectedFilter, setSelectedFilters] =
    useState<typeSelectedFilters>(initialFilterValue);

  const { branch, department, section, category } = selectedFilter;
  const { sortQuery, ...sorting } = useSorting();

  const fetchList = async (
    pageNumber: number,
    pageSize: number,
    search?: string,
    branch?: string,
    department?: string,
    section?: string,
    category?: string
  ) => {
    try {
      const res = await fetchAdminProcessList(
        pageNumber,
        pageSize,
        search,
        branch,
        department,
        section,
        category,
        "",
        sorting.sorting
      );
      setTotalCount(res?.count ?? 0);
      setProcessList(res?.results || []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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
    setSearchText(value);
    fetchList(1, 10, value, branch, department, section, category);
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
    branch: string,
    department: string,
    section: string,
    category: string
  ) => {
    fetchList(1, 10, "", branch, department, section, category);
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
    let temp = processList.map((item) =>
      item.uuid === uuid ? { ...item, is_active: value } : item
    );
    setProcessList(temp);
  };

  const toggleStatusAPI = async (uuid: string, payload: any) => {
    setLoadingStatus(uuid);
    const url = PROCESS_DEACTIVATE + uuid + "/";
    try {
      const res = await postMethod(url, payload);
      updateList(uuid, payload?.is_active);
      toast.success(res?.msg);
    } catch (error: any) {
      if (error) {
        toast.error(error);
      } else {
        toast.error(
          <FormattedMessage id="somethingWentWrong"></FormattedMessage>
        );
      }
    } finally {
      setLoadingStatus(null);
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
    {
      key: "created_by",
      label: <FormattedMessage id="adminThCreatedBy" />,
      render: (value: any, row: any) => row?.translations?.[locale]?.created_by,
    },

    {
      key: "created_at",
      label: <FormattedMessage id="adminThCreatedDate" />,
      render: (value: any) => formattedDate(value),
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
      key: "category",
      label: <FormattedMessage id="adminThCategory" />,
      render: (value: any, row: any) => (
        <>{row?.translations?.[locale]?.category}</>
      ),
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
      key: "add_files",
      label: <FormattedMessage id="files" />,
      render: (_: any, row: any) => (
        <Button
          startIcon={<BiPlus />}
          className="rtl:gap-[10px] w-[110px]"
          sx={{ textTransform: "capitalize" }}
          onClick={() => {
            setOpenFiles(row);
            getProcessDocs(row?.uuid);
          }}
        >
          <FormattedMessage id="addFiles" />
        </Button>
      ),
      hidden: !canWrite,
    },
    {
      key: "version",
      label: <FormattedMessage id="adminThVersion" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/processes/versions/" + row?.uuid}>
          <Button
            startIcon={<RemoveRedEyeOutlined />}
            className="rtl:gap-[10px]"
            sx={{ textTransform: "capitalize" }}
          >
            <FormattedMessage id="view" />
          </Button>
        </Link>
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

  const handleSubmit = () => {
    const formData = new FormData();

    fields
      ?.filter((item: any) => !item.id)
      ?.forEach((field, index) => {
        // formData.append(`items[${index}][name]`, field.name);
        if (field.file) {
          formData.append(field.name, field.file);
        }
      });
    AddFilesToProcess(formData);
  };

  const AddFilesToProcess = async (payload: FormData) => {
    setLoadingOpenFiles(true);
    const url = ADD_FILES_PROCESS + openFiles?.uuid + "/";
    try {
      const res = await postMethodWithFormData(url, payload);

      toast?.success(res?.msg);
    } catch (error: any) {
      if (typeof error === "string") {
        toast?.error(error);
      } else {
        toast.error(
          <FormattedMessage id="somethingWentWrong"></FormattedMessage>
        );
      }
    } finally {
      handleClose();
      setLoadingOpenFiles(false);
    }
  };

  const getProcessDocs = async (id: string) => {
    setProcessGetLoading(true);
    try {
      const res = await getMethod(GET_PROCESS_DOCS + id + "/");
      if (res.length === 0 || !res) {
        setFields(getInitialFields());
      } else {
        setFields(res);
      }
    } catch (error: any) {
      if (typeof error === "string") {
        toast?.error(error);
      } else {
        toast.error(
          <FormattedMessage id="somethingWentWrong"></FormattedMessage>
        );
      }
    } finally {
      // handleClose();
      setProcessGetLoading(false);
    }
  };

  const handleClose = () => {
    setFields(getInitialFields());
    setOpenFiles(null);
  };

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={processList && Array.isArray(processList) ? processList : []}
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
                  <FormattedMessage id="headingProcessManagement"></FormattedMessage>
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  <FormattedMessage id="subHeadingProcessManagement"></FormattedMessage>
                </p>
              </div>
            </div>
            {/* <DependentFilter fetchWithFilter={fetchWithDependentFilter} /> */}
          </div>
        }
        filterComponent={
          <DependentFilter
            fetchWithFilter={fetchWithDependentFilter}
            selectedFilter={selectedFilter}
            setSelectedFilters={setSelectedFilters}
          />
        }
        onSearchChange={handleSearchChange}
        isExport={true}
        exportURL={EXPORT_PROCESS_ADMIN}
      ></DataTable>

      <DialogCustomized
        open={!!openFiles}
        handleClose={handleClose}
        actions={
          <Stack direction="row" spacing={2}>
            <Button color="primary" onClick={handleClose}>
              {translate("cancel")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              disableElevation
              onClick={handleSubmit}
              disabled={loadingOpenFiles}
            >
              {translate("submitButton")}
            </Button>
          </Stack>
        }
        content={
          processGetLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <CircularProgress sx={{ height: "10px", width: "10px" }} />
            </div>
          ) : (
            <FilesDynamicForm
              onSubmit={handleSubmit}
              fields={fields}
              setFields={setFields}
            />
          )
        }
        title={
          <div className="flex items-center gap-2">
            <span>
              <FormattedMessage id="filesHeading"></FormattedMessage>
            </span>
            |
            <span className="text-primary">
              {openFiles?.translations?.[locale]?.name}
            </span>
          </div>
        }
      />
    </div>
  );
};

export default ProcessAdministration;

const FilesDynamicForm = ({
  fields,
  setFields,
  onSubmit,
}: {
  fields: any[];
  setFields: any;
  onSubmit: (formData: any) => void;
}) => {
  const { translate } = useTranslation();

  const [deleteLoader, setDeleteLoader] = useState<string | null>(null);
  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = [...fields];
    const { name, value, files } = event.target;

    if (name === "file" && files) {
      newFields[index].file = files[0];
    } else if (name === "name") {
      newFields[index].name = value;
    }

    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { name: "", file: null }]);
  };

  async function deleteProcessDoc(docId: string) {
    setDeleteLoader(docId);
    try {
      const res = await deleteMethod(`${DELETE_PROCESS_DOCS}${docId}/`);
      setFields(fields.filter((item, i) => item?.id !== docId));

      toast.success(
        res?.msg || (
          <FormattedMessage id="deletedSuccessfully"></FormattedMessage>
        )
      );
    } catch (e: any) {
      toast.error(e);
    } finally {
    }
  }
  const removeField = (index: number, field: any) => {
    if (field?.id) {
      deleteProcessDoc(field?.id);
    } else {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    // 🔍 Log for demonstration
    // for (let pair of formData?.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
  };

  async function fileFromUrl(
    url: string,
    fileName: string,
    mimeType?: string
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();

    // If mimeType is not provided, use the one from the fetched blob
    const fileType = mimeType || blob.type || "application/octet-stream";

    return new File([blob], fileName, { type: fileType });
  }

  function getFileNameFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      return decodeURIComponent(
        pathname.substring(pathname.lastIndexOf("/") + 1)
      );
    } catch {
      return "";
    }
  }

  return (
    <form>
      {fields?.map((field, index) => (
        <div
          key={index}
          style={{ marginBottom: "1rem", position: "relative" }}
          className="flex flex-col items-end justify-center gap-3 p-4 border rounded"
        >
          <InputField
            placeholder={translate("enterName")}
            label={<FormattedMessage id="name" />}
            type="text"
            name="name"
            value={field?.id ? field?.document_type : field?.name}
            onChange={(_, e) => handleInputChange(index, e)}
            disabled={field?.id}
          ></InputField>

          <>
            <FileUpload
              label={<FormattedMessage id="file"></FormattedMessage>}
              value={
                field?.id
                  ? { name: getFileNameFromUrl(field?.document_url) }
                  : field?.file
              }
              name={"file"}
              onChange={(e) => handleInputChange(index, e)}
              disabled={field?.id}
            />
            {/* {isSubmitted && formError?.[field.id] && (
              <FormHelperText
                error={true}
                sx={{ direction: "inherit", textAlign: "inherit" }}
              >
                <>{error}</>
              </FormHelperText>
            )} */}
          </>
          {fields.length > 1 && (
            <IconButton
              disabled={deleteLoader === field?.id}
              className="top-2"
              style={{
                position: "absolute",
                right: "0",
                top: "2px",
              }}
              size="small"
              color="error"
              onClick={() => {
                removeField(index, field);
              }}
            >
              <BiTrash />
            </IconButton>
          )}
          {/* <input
            type="file"
            name="file"
            onChange={(e) => handleInputChange(index, e)}
            required
          /> */}
        </div>
      ))}
      <div className="flex items-end">
        <Button type="button" onClick={addField} startIcon={<BiPlus />}>
          Add More
        </Button>{" "}
        {/* <Button variant="contained" type="submit">
          Submit
        </Button> */}
      </div>
    </form>
  );
};
