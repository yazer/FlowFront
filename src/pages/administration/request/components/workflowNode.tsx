import { Stack, Tooltip, Typography } from "@mui/material";
import { MdOutlineShare } from "react-icons/md";
import { FormattedMessage } from "react-intl";
import { Handle, Position } from "reactflow";

function WorkflowNode({ data }: any) {
  return (
    <div>
      <Handle position={Position.Left} type="target" isConnectable={false} />
      <Handle position={Position.Right} type="source" isConnectable={false} />
      <div className="flex flex-row justify-between items-center gap-4">
        <Stack direction="row" gap={1} alignItems="center" flex={1}>
          <MdOutlineShare color="blue" />
          <div>
            <Tooltip title={data?.label}>
              <Typography variant="subtitle1" width="215px" noWrap={true}>
                <FormattedMessage id={data?.label} />
              </Typography>
            </Tooltip>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default WorkflowNode;
