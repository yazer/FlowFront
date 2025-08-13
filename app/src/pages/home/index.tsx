// ProcessList Component
import HelpOutline from "@mui/icons-material/HelpOutline";
import Search from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FormattedMessage, useIntl } from "react-intl";
import "reactflow/dist/style.css";
import { getMethod, postMethod } from "../../apis/ApiMethod";
import { fetchRequirementDocuments } from "../../apis/flowBuilder";
import {
  CreateFavorite,
  createTrack,
  fetchProcessFormDetail,
  listProcessDashboard,
  processRequest,
  removeFavorite,
} from "../../apis/process";
import {
  GET_FILES_PROCESS,
  GET_USER_PROFILE,
  UPDATE_DATAGRID_COLUMN,
} from "../../apis/urls";
import DependentFilter, {
  typeSelectedFilters,
} from "../../components/DependentFilter/dependenFilter";
import DialogCustomized from "../../components/Dialog/DialogCustomized";
import DynamicFormPopup from "../../components/Modal/DynamicForm";
import NoResults from "../../components/NoResults";
import CustomPagination from "../../components/Pagination/pagination";
import useTranslation from "../../hooks/useTranslation";
import AttachmentListItem from "./attachmentItemCard";
import {
  HomeContextProvider,
  HomeContextType,
} from "./context/HomeFormContext";

const initialFilterValue = {
  category: "",
  department: "",
  branch: "",
  section: "",
  process: "",
};
export function ProcessList() {
  const [processes, setprocesses] = useState({ count: 0, results: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<
    string | undefined
  >(undefined);

  const [isLoading, setLoading] = useState(true);
  const [formData, setformData] = useState([]);
  const [processDetail, setprocessDetail] = useState<any>({});
  console.log(processDetail);

  const [nodeId, setNodeId] = useState("");
  const [actionList, setactionList] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const [selected, setSelected] = useState("all");
  const { locale } = useIntl();
  const [paginationState, setPaginationState] = useState({
    pageSize: 12,
    pageNumber: 1,
  });
  const [selectedFilter, setSelectedFilters] =
    useState<typeSelectedFilters>(initialFilterValue);

  const { branch, department, section, category } = selectedFilter;
  const [reqDocumentsDialog, setReqDocumentsDialog] = useState(false);
  const [helpDialog, setHelpDialog] = useState(false);

  const [requiredDocuments, setRequirementsDocuments] = useState([]);
  const [helpDocuments, setHelpDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [tableStatus, setTableStatus] = useState<HomeContextType>({});

  const { translate } = useTranslation();

  async function startProcess() {
    setOpenDialog(false);
    setLoading(true);
    try {
      const data: any = await processRequest({ process: selectedProcessId });
      toast.success(data);
    } catch (err) {
      console.log(err);
      toast.error("Process start failed");
    } finally {
      setLoading(false);
    }
  }

  const getProcessDetail = async (processId: string) => {
    try {
      if (!processId) {
        throw new Error("Process ID is not selected");
      }

      const processData: any = await fetchProcessFormDetail(processId);
      if (!processData.on_confirmation) {
        if (processData?.form?.length > 0) {
          // Check if form data is available
          setOpenForm(true);
          setformData(processData.form);
          setprocessDetail(processData);
          setactionList(processData.actions);
          setNodeId(processData?.node_uuid ?? "");
        } else {
          toast.error("No form data available for this process.");
        }
      } else {
        setOpenDialog(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Process details get error");
    }
  };

  const createTrackOnSubmit = async (
    formState: any,
    selectedAction: string
  ) => {
    if (selectedProcessId) {
      setIsLoader(true);

      try {
        await Promise.all(
          Object.entries(tableStatus).map(async ([tableId, value]) => {
            await postMethod(UPDATE_DATAGRID_COLUMN + tableId + "/", {
              column_name: value.column_name,
              value: value.value,
              row_id: value.row_id,
            });
          })
        );
        const data = await createTrack(
          selectedProcessId,
          selectedAction,
          nodeId,
          formState
        );
        setOpenForm(false);
        toast.success(data);
      } catch (err) {
        console.log(err);
        toast.error("Process start failed");
      } finally {
        setIsLoader(false);
      }
    }
  };

  useEffect(() => {
    fetchOrganizationFilterData();
  }, [paginationState, selected, searchTerm]);

  const fetchOrganizationFilterData = async () => {
    try {
      const res = await getMethod(GET_USER_PROFILE);

      if (res?.show_filter) {
        GetProcessList(
          selected === "favorites",
          category,
          paginationState,
          res?.department,
          res?.branch,
          res?.section,
          searchTerm
        );
      } else {
        GetProcessList(
          selected === "favorites",
          category,
          paginationState,
          department,
          branch,
          section,
          searchTerm
        );
      }
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  const GetProcessList = async (
    isfavoriote?: any,
    category?: any,
    paginationState?: any,
    department?: any,
    branch?: any,
    section?: any,
    search?: string
  ) => {
    setLoading(true);
    try {
      const data = await listProcessDashboard(
        isfavoriote,
        category,
        paginationState,
        department,
        branch,
        section,
        search
      );
      setLoading(false);
      setprocesses(data || []);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClickFavorite = async (
    process_id: any,
    is_favourite: boolean
  ) => {
    is_favourite
      ? handleRemoveFavorite(process_id)
      : handleAddFavorite(process_id);
  };

  const handleAddFavorite = async (process_id: any) => {
    const payload = {
      process_id: process_id,
    };
    try {
      await CreateFavorite(payload);
      GetProcessList();
    } catch (error) {
      // @ts-ignore
      toast.error(error?.message ?? "Something went wrong");
    }
  };

  const handleRemoveFavorite = async (process_id: any) => {
    try {
      await removeFavorite(process_id);
      GetProcessList(
        undefined,
        category,
        paginationState,
        department,
        branch,
        section
      );
    } catch (error) {
      // @ts-ignore
      toast.error(error?.message ?? "Something went wrong");
    }
  };

  function getTranslatedText(process: any, key: string) {
    return process.translations?.[locale]?.[key] || process[key];
  }

  const getRequirementDocuments = async (processId: any) => {
    try {
      const res = await fetchRequirementDocuments(processId);
      setRequirementsDocuments(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getHelpDocuments = async (processId: any) => {
    try {
      const res = await getMethod(GET_FILES_PROCESS + processId);
      setHelpDocuments(res ?? []);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWithDependentFilter = (
    branch?: string,
    department?: string,
    section?: string,
    category?: string
  ) => {
    GetProcessList(
      selected === "favorites",
      category,
      {
        pageNumber: 1,
        pageSize: 12,
      },
      department,
      branch,
      section
    );
  };

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  return (
    <div>
      <div className="flex flex-col items-start border-b px-[16px] p-[8px] gap-2">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              <FormattedMessage id="headingProceses" />
            </h1>
            <div className="inline-flex rounded-lg border border-blue-600 p-1 bg-blue-50">
              <button
                onClick={() => {
                  GetProcessList(
                    false,
                    category,
                    {
                      pageNumber: 1,
                      pageSize: 12,
                    },
                    department,
                    branch,
                    section
                  );
                  setSelected("all");
                  setPaginationState({ pageSize: 12, pageNumber: 1 });
                }}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selected === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                <FormattedMessage id="allButton"></FormattedMessage>
              </button>

              <button
                onClick={() => {
                  GetProcessList(
                    true,
                    category,
                    {
                      pageNumber: 1,
                      pageSize: 12,
                    },
                    department,
                    branch,
                    section
                  );
                  setSelected("favorites");
                  setPaginationState({ pageSize: 12, pageNumber: 1 });
                }}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  selected === "favorites"
                    ? "bg-primary text-white shadow-sm"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                <MdFavoriteBorder className="w-4 h-4" />
                <FormattedMessage id="favoritesButton"></FormattedMessage>
              </button>
            </div>
          </div>

          <TextField
            placeholder={translate("placeholderSearch")}
            size="small"
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <DependentFilter
          fetchWithFilter={fetchWithDependentFilter}
          selectedFilter={selectedFilter}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
      <div>
        {!isLoading &&
          (!Array.isArray(processes.results) ||
            processes.results?.length === 0) && (
            <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
              <NoResults />
            </div>
          )}
        <Grid
          container
          // gap={1}
          spacing={2}
          justifyContent="flex-start"
          width={"100%"}
          padding={"0 16px 16px 0"}
          margin={0}
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
              <CircularProgress />
            </div>
          ) : (
            processes?.results &&
            Array.isArray(processes?.results) &&
            processes?.results?.map((process: any, index: number) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                key={index}
                // sx={{ marginBottom: 3 }}
              >
                <Card
                  className="process-card"
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                    color: "#333",
                    fontFamily: "Arial, sans-serif",
                    height: "100%",
                    transition: "0.3s",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack direction="row" spacing={1}>
                        <Avatar
                          src={process?.icon_url}
                          component={Paper}
                          elevation={1}
                        >
                          {!process?.icon_url
                            ? process?.name?.[0].toUpperCase()
                            : undefined}
                        </Avatar>
                        <div className="flex flex-col">
                          <Typography variant="h6" component="div">
                            {getTranslatedText(process, "name")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {getTranslatedText(process, "description")}
                          </Typography>
                        </div>
                      </Stack>
                      <div className="flex items-center">
                        <IconButton
                          onClick={() =>
                            handleClickFavorite(
                              process?.uuid ?? "",
                              process?.is_favourite
                            )
                          }
                          size="small"
                          color="primary"
                          sx={{
                            top: 0,
                            right: 0,
                          }}
                        >
                          {process?.is_favourite ? (
                            <MdFavorite
                              className="text-primary"
                              style={{ fontSize: "22px" }}
                            />
                          ) : (
                            <MdFavoriteBorder style={{ fontSize: "22px" }} />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{
                            top: 0,
                            right: 0,
                          }}
                          onClick={() => {
                            setHelpDialog(true);
                            getHelpDocuments(process.uuid);
                          }}
                          // href={`/help/${process.uuid}`}
                        >
                          <HelpOutline />
                        </IconButton>
                      </div>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Box sx={{ display: "flex", width: "100%" }}>
                      <Button
                        size="small"
                        color="primary"
                        sx={{ textTransform: "uppercase" }}
                        onClick={() => {
                          setSelectedProcessId(process.uuid);
                          getProcessDetail(process.uuid);
                        }}
                      >
                        <FormattedMessage id="startProcess" />
                      </Button>
                      <Box sx={{ flexGrow: 1 }} />
                      <Button
                        size="small"
                        color="secondary"
                        sx={{ textTransform: "uppercase" }}
                        onClick={() => {
                          getRequirementDocuments(process.uuid);
                          setReqDocumentsDialog(true);
                        }}
                      >
                        <FormattedMessage id="requiredDocuments" />
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </div>
      {processes?.count > 12 && (
        <CustomPagination
          pageSize={paginationState?.pageSize}
          pageNumber={paginationState?.pageNumber}
          totalCount={processes?.count}
          onPageChange={(page: number) => {
            setPaginationState({ ...paginationState, pageNumber: page });
          }}
          onPageSizeChange={(size: any) => {
            setPaginationState({ ...paginationState, pageSize: size });
          }}
        />
      )}

      <DialogCustomized
        maxWidth={"md"}
        open={openForm && formData.length > 0}
        handleClose={(event: any, reason: string) => {
          if (reason && reason === "backdropClick") return;
          setOpenForm(false);
        }}
        actions={null}
        content={
          <HomeContextProvider
            tableStatus={tableStatus}
            setTableStatus={setTableStatus}
          >
            <DynamicFormPopup
              formData={formData}
              actionList={actionList}
              onClose={() => setOpenForm(false)}
              onSubmit={createTrackOnSubmit}
              loader={isLoader}
            />
          </HomeContextProvider>
        }
        title={
          <Typography variant="h5" style={{}}>
            {processes.results?.find(
              (process: any) => process.uuid === selectedProcessId
              // @ts-ignore
            )?.translations?.[locale]?.name ?? ""}{" "}
            |{" "}
            <span className="text-primary">
              {processDetail?.node_name?.[locale]}
            </span>
          </Typography>
        }
      />
      {/* {openForm && formData.length > 0 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={() => setOpenForm(false)}>
              ×
            </button> 
           <h2>{formData.name}</h2>
            <p>{formData.description}</p>
            <DynamicFormPopup
              formData={formData}
              actionList={actionList}
              onClose={() => setOpenForm(false)}
              onSubmit={createTrackOnSubmit}
              loader={isLoader}
            />
          </div>
        </div>
      )} */}

      <Dialog open={openDialog}>
        <DialogContent>
          <Typography variant="h5">
            <FormattedMessage id="areYouSureToStartProcess"></FormattedMessage>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialog(false)}>
            <FormattedMessage id="cancel"></FormattedMessage>
          </Button>
          <Button variant="contained" onClick={startProcess}>
            <FormattedMessage id="ok"></FormattedMessage>
          </Button>
        </DialogActions>
      </Dialog>

      <DialogCustomized
        open={reqDocumentsDialog}
        handleClose={() => setReqDocumentsDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setReqDocumentsDialog(false)}>Close</Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            <div className="space-y-4">
              {requiredDocuments?.length > 0 ? (
                requiredDocuments?.map((item: any, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900 text-md">
                        {/* <span className="text-gray-500 text-sm">
                        <FormattedMessage id="fileName"></FormattedMessage>:
                      </span>{" "} */}
                        {item?.translations?.[locale]?.label}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        <FormattedMessage id="max"></FormattedMessage>:{" "}
                        {item.max_file_size} KB
                      </span>
                    </div>

                    <span className="text-gray-500 text-sm">
                      <FormattedMessage id="supportedFiles"></FormattedMessage>:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item?.accept_file_validation?.map(
                        (format: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {format}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 text-center">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">ℹ️</h1>
                  <p className="text-gray-600 text-center">
                    <FormattedMessage id="noDocuments"></FormattedMessage>
                  </p>
                </div>
              )}
            </div>
          </Stack>
        }
        title={translate("requiredDocuments")}
      />

      <DialogCustomized
        open={helpDialog}
        handleClose={() => setHelpDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setHelpDialog(false)}>
              <FormattedMessage id="close"></FormattedMessage>
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            <div className="space-y-4">
              {helpDocuments?.length > 0 ? (
                helpDocuments?.map((el: any, index) => (
                  <AttachmentListItem
                    fileObj={el}
                    fileUrl={el?.document_url}
                    // onClick={handleClick}
                    isMultipleDownload={false}
                  />
                ))
              ) : (
                <div className="bg-white p-6 text-center">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">ℹ️</h1>
                  <p className="text-gray-600 text-center">
                    <FormattedMessage id="noDocuments"></FormattedMessage>
                  </p>
                </div>
              )}
            </div>
          </Stack>
        }
        title={translate("helpDocuments")}
      />
    </div>
  );
}

export default ProcessList;
