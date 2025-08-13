import "@fortawesome/fontawesome-free/css/all.min.css";
import { AttachFile } from "@mui/icons-material";
import { Avatar, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useTranslation from "../../hooks/useTranslation";
import "./inboxDetail.css";

type Props = {
  data: Record<string, any[]>;
  onClickAttachment: (data: any, attachmentType: boolean, item?: any) => void;
};

function BiHistory(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12 8L12 13 17 13 17 11 14 11 14 8z" />
      <path d="M21.292,8.497c-0.226-0.535-0.505-1.05-0.829-1.529c-0.322-0.478-0.691-0.926-1.099-1.333S18.51,4.86,18.032,4.537 c-0.482-0.326-0.997-0.604-1.528-0.829c-0.545-0.23-1.114-0.407-1.69-0.525c-1.181-0.243-2.444-0.244-3.626,0 c-0.579,0.118-1.147,0.295-1.69,0.524c-0.531,0.225-1.045,0.503-1.529,0.83C7.492,4.859,7.043,5.229,6.636,5.636 C6.229,6.043,5.859,6.492,5.537,6.968C5.211,7.452,4.932,7.966,4.708,8.496c-0.23,0.544-0.407,1.113-0.525,1.69 C4.062,10.778,4,11.388,4,12c0,0.008,0.001,0.017,0.001,0.025H2L5,16l3-3.975H6.001C6.001,12.017,6,12.008,6,12 c0-0.477,0.048-0.952,0.142-1.412c0.092-0.449,0.229-0.89,0.408-1.313c0.174-0.412,0.391-0.813,0.645-1.188 C7.445,7.716,7.733,7.368,8.05,7.05s0.666-0.605,1.036-0.855c0.376-0.254,0.777-0.471,1.19-0.646 c0.421-0.179,0.863-0.316,1.313-0.408c0.919-0.189,1.904-0.188,2.823,0c0.447,0.092,0.89,0.229,1.313,0.408 c0.413,0.174,0.813,0.392,1.188,0.644c0.37,0.251,0.72,0.539,1.037,0.856c0.317,0.316,0.604,0.665,0.855,1.037 c0.252,0.372,0.469,0.772,0.645,1.189c0.178,0.417,0.314,0.858,0.408,1.311C19.952,11.049,20,11.524,20,12 s-0.048,0.951-0.142,1.41c-0.094,0.455-0.23,0.896-0.408,1.314c-0.176,0.416-0.393,0.815-0.646,1.189 c-0.25,0.371-0.537,0.72-0.854,1.036c-0.317,0.317-0.667,0.605-1.036,0.855c-0.376,0.253-0.775,0.471-1.189,0.646 c-0.423,0.179-0.865,0.316-1.313,0.408c-0.918,0.188-1.902,0.189-2.823,0c-0.449-0.092-0.89-0.229-1.313-0.408 c-0.412-0.174-0.813-0.391-1.188-0.645c-0.371-0.25-0.719-0.538-1.037-0.855l-1.414,1.414c0.407,0.408,0.855,0.777,1.332,1.099 c0.483,0.326,0.998,0.605,1.528,0.829c0.544,0.23,1.113,0.407,1.69,0.525C11.778,20.938,12.388,21,13,21 c0.612,0,1.223-0.062,1.813-0.183c0.577-0.118,1.146-0.294,1.69-0.524c0.532-0.225,1.047-0.504,1.531-0.831 c0.476-0.322,0.923-0.691,1.33-1.098s0.776-0.855,1.098-1.331c0.325-0.48,0.604-0.995,0.83-1.529 c0.228-0.538,0.405-1.106,0.525-1.692C21.938,13.22,22,12.61,22,12s-0.062-1.22-0.183-1.814 C21.697,9.602,21.52,9.034,21.292,8.497z" />
    </svg>
  );
}
const TrackHistoryCard: React.FC<Props> = ({ data, onClickAttachment }) => {
  const { locale } = useIntl();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { translate } = useTranslation();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="w-12/12 bg-white rounded-[8px] border-[1px] border-[#DEDEDE8C] h-[auto] m-5 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-[#DEDEDE8C]">
          <div className="flex items-center gap-2">
            <Avatar src="/broken-image.jpg">
              <BiHistory />
            </Avatar>
            <div className="flex flex-col">
              <Typography variant="h5">
                <FormattedMessage id="trackHistory"></FormattedMessage>
              </Typography>
              {/* 
              <Typography variant="caption" color="text.secondary">
                <CalendarMonthIcon sx={{ fontSize: "12px" }} />{" "}
                <span>{data?.formatted_created_at}</span>
                {"-"}
                <span>{data?.created_time}</span>
              </Typography> */}
            </div>
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
            {data?.all_attachments?.length > 0 && (
              <Tooltip title={translate("inbox.attachmentTooltip")}>
                <IconButton
                  onClick={() => onClickAttachment(data?.all_attachments, true)}
                  sx={{ color: "primary.main" }}
                >
                  <AttachFile sx={{ transform: "rotate(45deg)" }} />
                </IconButton>
              </Tooltip>
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
          <div className="p-2">
            <table className="table-fixed min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[5%]">
                    <FormattedMessage id="sNo"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[20%]">
                    <FormattedMessage id="workflow"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[15%]">
                    <FormattedMessage id="user"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[15%]">
                    <FormattedMessage id="actionTaken"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[20%]">
                    <FormattedMessage id="remarks"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[15%]">
                    <FormattedMessage id="date"></FormattedMessage>
                  </th>
                  <th className="text-left rtl:text-right text-sm text-gray-700 font-semibold px-4 py-2 w-[10%]">
                    {/* <FormattedMessage id="date"></FormattedMessage> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.track_history?.map((item: any, index: number) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[5%]">
                      {/* <Tooltip title={item?.[locale]?.workflow} placement="top"> */}
                      <div>{index + 1}</div>
                      {/* </Tooltip> */}
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[20%]">
                      {/* <Tooltip title={item?.[locale]?.workflow} placement="top"> */}
                      <div>{item?.[locale]?.workflow}</div>
                      {/* </Tooltip> */}
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[15%]">
                      {/* <Tooltip title={item?.[locale]?.user} placement="top"> */}
                      <div>{item?.[locale]?.user}</div>
                      {/* </Tooltip> */}
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[15%]">
                      {/* <Tooltip
                        title={item?.[locale]?.action_taken}
                        placement="top"
                      > */}
                      <div>{item?.[locale]?.action_taken}</div>
                      {/* </Tooltip> */}
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[20%]">
                      {/* <Tooltip title={item?.[locale]?.remarks} placement="top"> */}
                      <div>{item?.[locale]?.remarks}</div>
                      {/* </Tooltip> */}
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[15%]">
                      <Tooltip title={item?.date} placement="top">
                        <div className="truncate">{item?.date}</div>
                      </Tooltip>
                    </td>
                    <td className="text-sm text-left rtl:text-right text-gray-600 px-4 py-2 max-w-0 w-[10%]">
                      {item?.attachments?.length > 0 && (
                        <Tooltip title={translate("inbox.attachmentTooltip")}>
                          <IconButton
                            onClick={() =>
                              onClickAttachment(item?.attachments, false, item)
                            }
                            sx={{ color: "primary.main" }}
                          >
                            <AttachFile sx={{ transform: "rotate(45deg)" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackHistoryCard;
