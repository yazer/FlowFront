import { Avatar, Typography } from "@mui/material";
import React from "react";
import { TiFlowMerge } from "react-icons/ti";
import { FormattedMessage } from "react-intl";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import RequestDetail from "../administration/request/requestDetail";

function RequestVisualizer({ id }: { id: string }) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }
  return (
    <>
      <div className="w-12/12 bg-white rounded-[8px] border-[1px] border-[#DEDEDE8C] h-[auto] m-5 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-[#DEDEDE8C]">
          <div className="flex items-center gap-2">
            <Avatar src="/broken-image.jpg">
              <TiFlowMerge />
            </Avatar>
            <div className="flex flex-col">
              <Typography variant="h5">
                <FormattedMessage id="requestVisualizerHeading"></FormattedMessage>
              </Typography>
            </div>
          </div>

          <button
            onClick={toggleCollapse}
            className="text-blue-400 hover:text-blue-800 focus:outline-none"
          >
            {isCollapsed ? (
              <MdOutlineKeyboardArrowDown className="h-7 w-7" />
            ) : (
              <MdOutlineKeyboardArrowUp className="h-7 w-7" />
            )}
          </button>
        </div>
        {!isCollapsed && (
          <div>
            <div className="p-5 h-[400px]">
              <RequestDetail requestId={id} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RequestVisualizer;
