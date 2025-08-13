/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";
import {
  fetchInboxDetails,
  fetchInboxDetailsCompleted,
  listInbox,
  setIsRead,
  updateTrack,
} from "../../apis/inbox";
// import InputField from "../../components/FormElements/components/InputField";
import { Icon } from "@iconify/react";
import { Add } from "@mui/icons-material";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilter } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl";
import { ResizableBox } from "react-resizable";
import { getMethod } from "../../apis/ApiMethod";
import { deleteFilter, getUserFilter } from "../../apis/flowBuilder";
import { GET_INBOX_WORKFLOW } from "../../apis/urls";
import useTranslation from "../../hooks/useTranslation";
import AddFilters from "./AddFilters";
import AllAttachment from "./Attachments/AllAttachment";
import FilterChip from "./FilterChip";
import "./inbox.css";
import EmailDetailCard from "./inboxDetail";
import TrackHistoryCard from "./inboxTrackHistoryCard";
import RequestDetailCard from "./requestDetailCard";
import RequestVisualizer from "./RequestVisualizer";
import WorkFlowStepper from "./workFlowStepper/WorkflowStepper";

const filterInitialValue = {
  startDate: "",
  endDate: "",
};

export function Inbox(category: any) {
  const { locale } = useIntl();
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  const [inboxList, setinboxList] = useState<any>([]);

  const [selectedInboxDetails, setSelectedInboxDetails] = useState<any>({});
  const [dialog, setDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState<any>(null);
  const [actionId, setActionId] = useState<any>(null);
  const location = useLocation();
  const [allAttachmentDrawer, setAllAttachmentDrawer] = useState(false);
  const [createFilerOpen, setCreateFilterOpen] = useState(false);
  const [attachmentType, setAttachmentType] = useState(false);
  const { translate } = useTranslation();
  const [selectedTrackHistory, setSelectedTrackHistory] = useState<any>([]);
  const [filterList, setFilterList] = useState([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<any>(null);
  const [inboxWidth, setInboxWidth] = useState<any>(400);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInboxWidth(Number(localStorage.getItem("inbox-width")) || 400);
  }, []);

  const [searchValue, setSearchValue] = useState("");

  const handleClear = () => {
    setSearchValue("");
  };

  const [filterChipSelected, setFilterChipSelected] = useState<
    { name: string; color: string; is_default?: boolean } | undefined
  >(undefined);

  const scrollRef: any = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  const handleClose = () => {
    setDialog(false);
  };
  const handleTriggerAction = async () => {
    const formData: any = {};

    // Select all the form fields inside the specific div (including file inputs)
    const formFields = document.querySelectorAll(
      ".px-5 input, .px-5 select, .px-5 textarea"
    );

    formFields.forEach((inputField: any) => {
      // const fieldLabel = inputField.previousElementSibling?.innerText; // Assuming label is the previous sibling
      const fieldName = inputField.name; // Assuming label is the previous sibling
      if (fieldName) {
        // Handle file inputs separately
        if (inputField.type === "file" && inputField.files.length > 0) {
          formData[fieldName] = inputField.files[0]; // Capture the first file selected
        } else {
          formData[fieldName] = inputField.value; // Capture text value for other fields
        }
      }
    });

    try {
      formData["uuid"] = actionId;
      formData["in_uuid"] = selectedInboxDetails.in_uuid;

      // Assuming updateTrack will handle multipart/form-data
      await updateTrack(formData, formData); // Pass both formData and file data

      handleClose(); // Close the dialog after API call
    } catch (error) {
      console.error("Failed to track process:", error);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", updateScrollButtons);
    }
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [filterList]);

  useEffect(() => {
    if (location.state?.display) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    getInboxList();
  }, [category.category, searchValue, selectedFilter]);

  useEffect(() => {
    setSelectedInboxDetails({});
    setSelectedTrackHistory([]);
  }, [category.category]);

  useEffect(() => {
    getUserFilterList();
  }, []);

  async function getUserFilterList() {
    try {
      const data = await getUserFilter();
      setFilterList(data ?? []);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshInboxList = async (filter?: any) => {
    try {
      const data = await listInbox(
        category.category,
        searchValue,
        selectedFilter === "allmails" ? "" : selectedFilter,
        filter?.startDate ?? "",
        filter?.endDate ?? ""
      );
      setinboxList(data);
      setLoading(false);
      // if (category.category === "inprogress") {
      //   getInboxDetails(data[0].uuid);
      // }
      // getInboxTrackHistory(data[0].uuid);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getInboxList = async (filter?: any) => {
    setLoading(true);
    try {
      const data = await listInbox(
        category.category,
        searchValue,
        selectedFilter === "allmails" ? "" : selectedFilter,
        filter?.startDate ?? "",
        filter?.endDate ?? ""
      );
      setinboxList(data);
      setLoading(false);
      // if (category.category === "inprogress") {
      //   getInboxDetails(data[0].uuid);
      // }
      // getInboxTrackHistory(data[0].uuid);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getInboxDetails = async (id: any) => {
    let data;
    try {
      if (category.category === "inprogress") {
        data = await fetchInboxDetails(id);
      } else {
        data = await fetchInboxDetailsCompleted(id);
      }
      let workflowtimeline: any[] = [];
      if (data?.request_uuid) {
        workflowtimeline = await getMethod(
          GET_INBOX_WORKFLOW + data.request_uuid
        );
      }
      setSelectedInboxDetails({
        ...data,
        workflowtimeline: workflowtimeline,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const handleAction = (item: any) => {
    setDialogItem(item); // Set the current action item in dialog
    setActionId(item.uuid);
    setDialog(true);
  };

  async function deleteChip(chip: any) {
    try {
      await deleteFilter(chip.uuid);
    } catch (error) {
      console.log(error);
    } finally {
      getUserFilterList();
    }
  }

  function editChip(chip: any) {
    setFilterChipSelected({ ...chip, colour: chip.color });
    setCreateFilterOpen(true);
  }

  const [filters, setFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterApplied, setIsFilteredApplied] = useState(false);
  const dropdownRef = useRef(null);

  const handleFilterChange = (name: string, value: any) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const ApplyFilter = () => {
    setIsOpen(false);
    setIsFilteredApplied(true);
    if (filters.startDate || filters.endDate) {
      getInboxList(filters);
    }
  };

  const [attachmentData, setAttachmentData] = useState<any[]>([]);
  const [attachmentWorkflowName, setAttachmentWorkflowName] = useState([]);
  const onClickAttachment = async (
    attachmentData: any,
    isAllAttachments: boolean,
    item: any
  ) => {
    setAttachmentType(isAllAttachments);
    setAllAttachmentDrawer(true);
    setAttachmentWorkflowName(item);

    let updatedAllAttachments: any[] = [];

    if (isAllAttachments) {
      updatedAllAttachments = attachmentData?.map((item: any) => {
        return {
          translation: item?.translation ?? {},
          attachments: getAttachmentsFlat(item?.attachments),
        };
      });
    }

    if (isAllAttachments) {
      setAttachmentData(updatedAllAttachments);
    } else {
      setAttachmentData([
        { translation: item, attachments: getAttachmentsFlat(attachmentData) },
      ]);
    }
  };

  const getAttachmentsFlat = (data: any) => {
    let updatedData: any[] = [];

    data?.forEach((item: any) => {
      if (item?.element_type === "MULTI_FILE_UPLOAD") {
        item?.value?.forEach((file: any) => {
          let obj = {
            ...item,
            value: file ?? "",
            file_url: file ?? "",
          };
          updatedData.push(obj);
        });
      } else {
        updatedData.push(item);
      }
    });

    return updatedData;
  };

  const postIsRead = async (trackId: any) => {
    try {
      await setIsRead(trackId);
      refreshInboxList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row h-full">
      {createFilerOpen && (
        <AddFilters
          open={createFilerOpen}
          handleClose={() => {
            setFilterChipSelected(undefined);
            setCreateFilterOpen(false);
          }}
          onCreateSuccess={getUserFilterList}
          value={filterChipSelected}
        />
      )}
      <ResizableBox
        width={inboxWidth}
        height={80}
        axis="x"
        resizeHandles={["e"]}
        onResizeStop={(_, { size }) => {
          localStorage.setItem("inbox-width", String(size.width));
        }}
        onResize={(_, { size }) => {
          setInboxWidth(size.width);
        }}
        minConstraints={[300, 0]}
        maxConstraints={[700, 0]}
        handle={
          <div
            style={{
              width: "2px",
              cursor: "ew-resize",
              backgroundColor: "#e5e7eb",
              height: document.getElementsByTagName("main")?.[0]?.clientHeight,
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
        }
      >
        <div className={`border-r border-gray-200 min-w-[${inboxWidth}px]`}>
          <>
            <div className="border-b pb-2">
              <div className="p-3 pr-1 pb-2 gap-1 flex flex-row items-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <AiOutlineSearch size={20} />
                  </div>

                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={translate("placeholderSearch")}
                    className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 
                        bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:border-transparent placeholder-gray-400"
                  />

                  {searchValue && (
                    <button
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                   hover:text-gray-600 focus:outline-none"
                    >
                      <MdClose size={20} />
                    </button>
                  )}
                </div>

                <div className="relative inline-block">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 px-3 py-3 text-white rounded-lg bg-primary shadow-xs hover:bg-blue-700"
                  >
                    <BsFilter className="w-4 h-4" />
                  </button>
                  {isOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-lg z-[1000]"
                      onBlur={(e) => setIsOpen(false)} // Prevent click inside dropdown from closing it
                    >
                      <h4 className="mb-2">
                        <FormattedMessage id="filtersText" />
                      </h4>
                      <div className="flex-1 w-full">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-600">
                            <FormattedMessage id="filterDateRange"></FormattedMessage>
                          </label>
                          <div className="gap-2 items-center flex-row align-middle">
                            <input
                              type="date"
                              value={filters.startDate}
                              onChange={(e) =>
                                handleFilterChange("startDate", e.target.value)
                              }
                              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <span>
                            <FormattedMessage id="filterTo"></FormattedMessage>
                          </span>
                          <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) =>
                              handleFilterChange("endDate", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => {
                            setFilter(filterInitialValue);
                          }}
                          className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          <FormattedMessage id="filterReset" />
                        </button>
                        <button
                          onClick={ApplyFilter}
                          className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-blue-700"
                        >
                          <FormattedMessage id="filterApply" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <IconButton onClick={() => setCreateFilterOpen(true)}>
                  <Add />
                </IconButton>
              </div>
              {isFilterApplied && (filters?.startDate || filters?.endDate) && (
                <div className="ml-3 flex items-center justify-start gap-2">
                  <div className="inline-flex items-center px-3 py-1 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-700">
                      {filters?.startDate && (
                        <span className="flex items-center">
                          <span className="text-gray-500">
                            <FormattedMessage id="from" />:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {new Date(filters?.startDate).toLocaleDateString()}
                          </span>
                        </span>
                      )}
                      {filters?.startDate && filters?.endDate && (
                        <span className="text-gray-400 px-2">•</span>
                      )}
                      {filters?.endDate && (
                        <span className="flex items-center">
                          <span className="text-gray-500">
                            <FormattedMessage id="to" />:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {new Date(filters?.endDate).toLocaleDateString()}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilter(filterInitialValue);
                      setIsFilteredApplied(false);
                      refreshInboxList(filterInitialValue);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-primary rounded-lg shadow-sm text-white hover:bg-blue-700"
                  >
                    <MdClose />
                    <FormattedMessage id="clearFilter" />
                  </button>
                </div>
              )}
            </div>

            <Stack alignItems="center" direction="row" paddingY={1} spacing={1}>
              <IconButton
                onClick={scrollLeft}
                className="hover:bg-gray-300 p-1 rounded-md"
                disabled={!canScrollLeft}
                size="small"
              >
                <MdChevronLeft size={25} />
              </IconButton>

              <Stack
                direction="row"
                spacing={1.5}
                flex={1}
                overflow="hidden"
                ref={scrollRef}
              >
                <FilterChip
                  name={"All Mails"}
                  color={"blue"}
                  selected={"allmails" === selectedFilter}
                  onClick={() => setSelectedFilter("allmails")}
                  chipData={{
                    uuid: "allmails",
                    color: "blue",
                    name: "All Mails",
                  }}
                />
                {filterList &&
                  Array.isArray(filterList) &&
                  filterList?.map((chip: any) => {
                    return (
                      <FilterChip
                        name={chip.name}
                        color={chip.color}
                        key={chip.uuid}
                        selected={chip.uuid === selectedFilter}
                        onClick={() => setSelectedFilter(chip.uuid)}
                        onDelete={deleteChip}
                        onEdit={editChip}
                        chipData={chip}
                      />
                    );
                  })}
              </Stack>

              <IconButton
                onClick={scrollRight}
                className="hover:bg-gray-300 p-1 rounded-md"
                disabled={!canScrollRight}
                size="small"
              >
                <MdChevronRight size={25} />
              </IconButton>
            </Stack>
            <div className="inbox-container h-[calc(100vh_-_186px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
                  <CircularProgress />
                </div>
              ) : (
                Array.isArray(inboxList) &&
                inboxList?.map((section: any, index: any) => {
                  const isUnreadStyle =
                    (activeSectionIndex !== index &&
                      section.is_read &&
                      category.category === "inprogress") ||
                    (activeSectionIndex !== index &&
                      category.category === "completed");

                  return (
                    <div
                      key={section?.uuid}
                      className={`inbox-item ${
                        activeSectionIndex === section?.uuid ? "active" : ""
                      }`}
                      style={{
                        opacity: isUnreadStyle ? 0.7 : 1,
                      }}
                      onClick={() => {
                        setIsShow(true);
                        setActiveSectionIndex(section.uuid);
                        if (category.category === "inprogress") {
                          postIsRead(section?.uuid);
                        }
                        getInboxDetails(section?.uuid);
                        setSelected(section);
                        setAllAttachmentDrawer(false);
                        setAttachmentType(false);
                      }}
                    >
                      <div className="inbox-item-content flex gap-3">
                        <Avatar src={section?.process_icon}>
                          {section?.node_name?.[
                            locale
                          ]?.label?.[0].toUpperCase()}
                        </Avatar>
                        <div className="inbox-item-details">
                          <span className="inbox-item-label">
                            <Typography
                              variant="h5"
                              fontWeight={isUnreadStyle ? "normal" : "bold"}
                            >
                              {[
                                section?.process_name?.[locale]?.name,
                                section?.node_name?.[locale]?.label,
                              ]
                                .filter(Boolean)
                                .join(
                                  section?.process_name?.[locale]?.name &&
                                    section?.node_name?.[locale]?.label
                                    ? " | "
                                    : ""
                                ) || "No Name"}{" "}
                            </Typography>
                          </span>

                          <div>
                            <Typography variant="caption" color="text.primary">
                              {[
                                section?.request_id,
                                section?.formatted_created_at,
                              ]
                                .filter(Boolean)
                                .join(" | ") || "No Details"}
                            </Typography>
                          </div>
                          <span className="inbox-item-date flex items-center gap-1">
                            <Icon icon="solar:user-bold-duotone" />
                            {section?.from_user?.[locale]?.name ?? (
                              <FormattedMessage id="notSpecified"></FormattedMessage>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        </div>
      </ResizableBox>
      <div
        style={{
          width: `calc(100% - ${inboxWidth}px)`,
          display: allAttachmentDrawer ? "block" : "none",
        }}
      >
        <AllAttachment
          open={allAttachmentDrawer}
          onClose={() => {
            setAllAttachmentDrawer(false);
            setAttachmentType(false);
          }}
          data={attachmentData}
          isAllAttachment={true}
        />
      </div>
      <div
        style={{
          width: `calc(100% - ${inboxWidth}px)`,
          display: !allAttachmentDrawer ? "block" : "none",
        }}
      >
        <div className="w-full border-b p-5">
          {selected && (
            <div className="flex justify-between items-center">
              <div className="flex flex-row items-center gap-2">
                <div className="px-2 overflow-hidden justify-center">
                  <Avatar
                    src={selected?.process_icon}
                    sx={{ width: 45, height: 45 }}
                  >
                    {selected?.node_name?.[locale]?.label
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </Avatar>
                </div>
                <div className="flex flex-col justify-center gap-0.5">
                  <Typography variant="h5" fontSize={"18px"}>
                    {[
                      selected?.process_name?.[locale]?.name,
                      selected?.node_name?.[locale]?.label,
                    ]
                      .filter(Boolean)
                      .join(
                        selected?.process_name?.[locale]?.name &&
                          selected?.node_name?.[locale]?.label
                          ? " | "
                          : ""
                      ) || "No Name"}{" "}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Typography variant="caption" color="text.primary">
                      {[selected?.request_id, selected?.formatted_created_at]
                        .filter(Boolean)
                        .join(" | ") || "No Details"}
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                      <span className="flex items-center gap-1"></span>
                    </Typography>
                  </div>
                  <span className="inbox-item-date flex items-center gap-1">
                    <Icon icon="solar:user-bold-duotone" />
                    {selected?.from_user?.[locale]?.name ?? (
                      <FormattedMessage id="notSpecified"></FormattedMessage>
                    )}
                  </span>
                  {/* <Typography>
                    <span className="inbox-item-date flex items-center gap-1">
                      <Icon icon="solar:calendar-linear" />
                      {selected?.formatted_created_at}
                    </span>
                  </Typography> */}
                  {/* <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize={"14px"}
                  >
                    <FormattedMessage id="requestId"></FormattedMessage>:{" "}
                    <span
                      className="text-gray-700 font-medium
"
                    >{`${selected?.request_id}`}</span>
                  </Typography> */}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="flex flex-row h-full"
          style={{
            height: "calc(100vh - 148px)",
          }}
        >
          <div
            className="flex-1"
            style={{
              height: "calc(100vh - 148px)",
              overflowY: "auto",
            }}
          >
            {selectedInboxDetails?.request_details?.length > 0 && (
              <>
                <RequestDetailCard
                  data={selectedInboxDetails}
                  // onClickAttachment={onClickAttachment}
                />

                <Divider sx={{ mt: 2 }} />
              </>
            )}
            {category?.category === "inprogress" &&
              (selectedInboxDetails?.action_form?.length > 0 ||
                selectedInboxDetails?.actions?.length > 0) && (
                <>
                  <EmailDetailCard
                    isActionForm={true}
                    category={category.category}
                    selectedInboxDetails={selectedInboxDetails}
                    selected={selected}
                    handleAction={handleAction}
                    refreshInbox={() => {
                      setSelectedInboxDetails({});
                      getInboxList();
                    }}
                    defaultExpanded={true}
                  />

                  <Divider sx={{ mt: 2 }} />
                </>
              )}
            {selectedInboxDetails?.track_history?.length > 0 && (
              <>
                <TrackHistoryCard
                  data={selectedInboxDetails}
                  onClickAttachment={onClickAttachment}
                />

                <Divider sx={{ mt: 2 }} />
              </>
            )}
            {selectedInboxDetails.request_uuid && (
              <RequestVisualizer id={selectedInboxDetails.request_uuid} />
            )}
          </div>

          <div className="max-w-[200] h-full overflow-y-auto">
            {selectedInboxDetails?.workflowtimeline?.length > 0 && (
              <WorkFlowStepper
                steps={selectedInboxDetails.workflowtimeline}
                activeStep={selectedInboxDetails.workflowtimeline.findIndex(
                  (node: any) => node.status === "in_progress"
                )}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Conditionally render the message based on dialogItem.completed */}
            {dialogItem && !dialogItem.completed
              ? "Are you sure you want to trigger with this action?"
              : "This action is already triggered."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* Render Confirm button only if dialogItem.completed is false */}
          {dialogItem && !dialogItem.completed && (
            <Button onClick={handleTriggerAction}>Confirm</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
