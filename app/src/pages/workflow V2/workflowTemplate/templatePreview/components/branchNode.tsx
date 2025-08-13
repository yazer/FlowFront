import { Stack, Tooltip, Typography } from "@mui/material";
import { LuDiamond } from "react-icons/lu";
import { FormattedMessage } from "react-intl";
import { Handle, Position } from "reactflow";

function BranchNode({ data }: any) {
  return (
    <div>
      <Handle position={Position.Left} type="target" isConnectable={false} />
      <Handle position={Position.Right} type="source" isConnectable={false} />
      <div className="flex flex-row justify-between items-center gap-4">
        <Stack direction="row" gap={2} alignItems="center">
          <LuDiamond color="blue" />
          <Typography variant="subtitle1">
            <FormattedMessage id={"addConditions"} />
          </Typography>
        </Stack>
      </div>
    </div>
  );
}

export default BranchNode;
