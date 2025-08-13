import "@fortawesome/fontawesome-free/css/all.min.css";
import { Avatar, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import "./inboxDetail.css";
import ReadOnlyForm from "./inboxReadOnlyform";

type Props = {
  data: Record<string, any[]>;
  //   onClickAttachment: () => void;
};

function BsFileText(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M4 1h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V3a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H4z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M4.5 10.5A.5.5 0 015 10h3a.5.5 0 010 1H5a.5.5 0 01-.5-.5zm0-2A.5.5 0 015 8h6a.5.5 0 010 1H5a.5.5 0 01-.5-.5zm0-2A.5.5 0 015 6h6a.5.5 0 010 1H5a.5.5 0 01-.5-.5zm0-2A.5.5 0 015 4h6a.5.5 0 010 1H5a.5.5 0 01-.5-.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const RequestDetailCard: React.FC<Props> = ({ data }) => {
  const { locale } = useIntl();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  //   const fileUploadCount =
  //     (selectedInboxDetails?.action_form &&
  //       Array.isArray(selectedInboxDetails?.action_form) &&
  //       selectedInboxDetails?.action_form?.filter(
  //         (item: FormDataItem) =>
  //           item.element_type === "FILE_UPLOAD" ||
  //           item.element_type === "MULTI_FILE_UPLOAD"
  //       ).length) ||
  //     0;

  return (
    <>
      <div className="w-12/12 bg-white rounded-[8px] border-[1px] border-[#DEDEDE8C] h-[auto] m-5 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-[#DEDEDE8C]">
          <div className="flex items-center gap-2">
            <Avatar src="/broken-image.jpg">
              <BsFileText />
            </Avatar>
            <div className="flex flex-col">
              <Typography variant="h5">
                <FormattedMessage id="requestDetails"></FormattedMessage>
              </Typography>
              {/* 
              <Typography variant="caption" color="text.secondary">
                <CalendarMonthIcon sx={{ fontSize: "12px" }} />{" "}
                <span>{data?.formatted_created_at}</span>
                {"-"}
                <span>{data?.created_time}</span>
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
            {/* {!!fileUploadCount && category === "completed" && (
              <Button
                variant="text"
                sx={{ textTransform: "none" }}
                startIcon={<AttachFile sx={{ transform: "rotate(45deg)" }} />}
                onClick={onClickAttachment}
              >
                <FormattedMessage id="attachment"></FormattedMessage>
              </Button>
            )} */}

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
          <div className="p-2">
            <div className="space-y-3">
              {data?.request_details?.map((item: any, index: number) => (
                <div key={index}>
                  {/* Circle step indicator */}
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="bg-blue-50 p-2 rounded-md mb-2">
                      <Stack direction="row" spacing={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontSize={"14px"}
                        >
                          <FormattedMessage id="workflowStage"></FormattedMessage>
                          : {`${item?.name?.[locale]}`}
                        </Typography>
                        <Typography variant="h5"></Typography>
                      </Stack>
                    </div>
                    {/* <div className="text-sm text-gray-600 mb-1 font-semibold">
                      Request Id:{item?.name?.[locale]}
                    </div> */}

                    {/* Optional: File download buttons */}
                    {/* {item?.files?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.files.map((file: any) => (
                        <a key={file?.id} href={file?.url} download>
                          <button className="bg-[#DBEDFF] rounded-[8px] px-3 py-2 flex items-center space-x-2 text-sm">
                            <span>{file?.name}</span>
                            <AiOutlineDownload />
                          </button>
                        </a>
                      ))}
                    </div>
                  )} */}

                    {/* Form data */}
                    <ReadOnlyForm formData={item?.request_details ?? []} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RequestDetailCard;
