import "@fortawesome/fontawesome-free/css/all.min.css";
import { AttachFile } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Avatar, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FormattedMessage, useIntl } from "react-intl";
import { createNextTrack } from "../../apis/inbox";
import DynamicFormPopup from "../../components/Modal/DynamicForm";
import "./inboxDetail.css";
import ReadOnlyForm from "./inboxReadOnlyform";

type InboxDetail = {
  node_name: any;
  is_completed: boolean;
  formatted_created_at: string;
  created_time: string;
  uuid: string;
  action_form: Array<FormDataItem>;
  actions: Array<any>;
  request_details: any;
};

type FormDataItem = {
  input_type?: string;
  title?: string;
  label?: string;
  placeholder?: string;
  val?: string;
  attachment_url?: string;
  [key: string]: any;
};

type ActionItem = {
  label: string;
  is_completed: boolean;
};

type Props = {
  selectedInboxDetails: InboxDetail | null;
  selected: any;
  handleAction: (action: ActionItem) => void;
  readOnly?: boolean;
  refreshInbox?: any;
  onClickAttachment?: () => void;
  category: string;
  defaultExpanded?: boolean;
  isActionForm?: boolean;
};

function AiOutlineForm(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M904 512h-56c-4.4 0-8 3.6-8 8v320H184V184h320c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V520c0-4.4-3.6-8-8-8z" />
      <path d="M355.9 534.9L354 653.8c-.1 8.9 7.1 16.2 16 16.2h.4l118-2.9c2-.1 4-.9 5.4-2.3l415.9-415c3.1-3.1 3.1-8.2 0-11.3L785.4 114.3c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-415.8 415a8.3 8.3 0 0 0-2.3 5.6zm63.5 23.6L779.7 199l45.2 45.1-360.5 359.7-45.7 1.1.7-46.4z" />
    </svg>
  );
}

const EmailDetailCard: React.FC<Props> = ({
  isActionForm = false,
  selectedInboxDetails,
  selected,
  handleAction,
  readOnly,
  refreshInbox,
  onClickAttachment,
  category,
  defaultExpanded = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);
  const [loading, setLoading] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fileUploadCount =
    (selectedInboxDetails?.action_form &&
      Array.isArray(selectedInboxDetails?.action_form) &&
      selectedInboxDetails?.action_form?.filter(
        (item: FormDataItem) =>
          item.element_type === "FILE_UPLOAD" ||
          item.element_type === "MULTI_FILE_UPLOAD"
      ).length) ||
    0;

  const createTrackOnSubmit = async (
    formState: any,
    selectedAction: string,
    remarks: string
  ) => {
    // if (selectedProcessId) {
    setLoading(true);
    try {
      const data = await createNextTrack(
        selected?.uuid ?? "",
        selectedAction,
        formState,
        remarks
      );
      toast.success(data);
      refreshInbox?.();
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {selected && selectedInboxDetails && (
        <div className="w-12/12 bg-white rounded-[8px] border-[1px] border-[#DEDEDE8C] h-[auto] m-5 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-[#DEDEDE8C]">
            <div className="flex items-center gap-2">
              <Avatar src="/broken-image.jpg">
                <AiOutlineForm />
              </Avatar>
              <div className="flex flex-col">
                <Typography variant="h5">
                  <FormattedMessage id="actionDetails"></FormattedMessage>
                </Typography>

                {/* <Typography variant="caption" color="text.secondary">
                  <CalendarMonthIcon sx={{ fontSize: "12px" }} />{" "}
                  <span>{selectedInboxDetails?.formatted_created_at}</span>
                  {"-"}
                  <span>{selectedInboxDetails?.created_time}</span>
                </Typography> */}
              </div>

              {/* {fileUploadCount > 0 && (
                <div className="ml-4 flex items-center text-sm text-gray-700">
                  <i className="fas fa-paperclip text-blue-500 mr-2"></i>
                  <span className="text-blue-600 font-medium">
                    {fileUploadCount} attachment{fileUploadCount > 1 ? "s" : ""}{" "}
                    required
                  </span>
                </div>
              )} */}
            </div>

            <div className="flex items-center gap-2">
              {!!fileUploadCount && category === "completed" && (
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  startIcon={<AttachFile sx={{ transform: "rotate(45deg)" }} />}
                  onClick={onClickAttachment}
                >
                  <FormattedMessage id="attachment"></FormattedMessage>
                </Button>
              )}

              <button
                onClick={toggleCollapse}
                className="text-blue-400 hover:text-blue-800 focus:outline-none"
              >
                <i
                  className={`fas fa-chevron-${isCollapsed ? "down" : "up"}`}
                ></i>
              </button>
            </div>
          </div>

          {!isCollapsed && (
            <div className="px-5 py-5">
              <div className="m-2 flex justify-center items-center">
                <div className="w-full space-y-4 ">
                  <div className="flex flex-wrap gap-[10px]">
                    {/* {fileArray.map((item: any) => (
                      <a key={item?.id} href="">
                        <button className="bg-[#DBEDFF] rounded-[8px] p-[10px]  flex items-center space-x-2">
                          <span> {item?.name}</span>
                          <AiOutlineDownload/>
                        </button>
                      </a>
                    ))} */}
                  </div>
                  {readOnly ? (
                    <ReadOnlyForm
                      formData={selectedInboxDetails?.action_form ?? []}
                    />
                  ) : (
                    <DynamicFormPopup
                      formData={
                        readOnly ? [] : selectedInboxDetails?.action_form ?? []
                      }
                      actionList={selectedInboxDetails?.actions}
                      onSubmit={createTrackOnSubmit}
                      loader={loading}
                      isActionForm={isActionForm}
                      selected={selected}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default EmailDetailCard;
