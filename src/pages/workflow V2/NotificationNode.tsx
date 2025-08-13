import { Box, Divider, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdOutlineNotifications } from "react-icons/md";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { deleteWorkFlowNode } from "../../apis/flowBuilder";
import "./branch-node.scss";
import DropDownNode from "./DropDownNode";
import "./notification-node.scss";
import MultiSelectDropdownNode from "./MultiSelectDropDownNode";

interface CustomNodeData {
  label?: string;
}

type CustomNodeProps = NodeProps<CustomNodeData>;

const CustomNode: React.FC<CustomNodeProps> = ({ data, id }: any) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [field, setField] = useState("");
  const [operator, setOperator] = useState("");
  const reactFlowInstance = useReactFlow();

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleDeleteNode = async () => {
    try {
      await deleteWorkFlowNode(id);
      reactFlowInstance.deleteElements({ nodes: [{ id }] });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Handle type="target" id={`${id}-left`} position={Position.Left} />
      <Handle type="target" id={`${id}-left`} position={Position.Right} />
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <MdOutlineNotifications color="blue" />
            <Typography variant="subtitle1">Notification Node</Typography>
          </Stack>
          <Stack direction="row">
            <button
              className="ml-1 p-1 hover:bg-slate-300 rounded-md"
              onClick={toggleMinimize}
              title={isMinimized ? "Expand Details" : "Collapse Details"}
            >
              {isMinimized ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </button>
            <button
              className="ml-1 p-1 hover:bg-slate-300 rounded-md"
              onClick={handleDeleteNode}
              title={"Delete"}
            >
              <AiOutlineDelete />
            </button>
          </Stack>
        </div>

        {!isMinimized && (
          <>
            <Box height="8px"></Box>
            <Divider />
            <div
              style={{
                transition: "opacity 0.3s ease",
                marginTop: "10px",
                marginBottom: "10px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "grey",
                  fontSize: "11px",
                  fontWeight: "600",
                }}
              >
                Add Notification to your Systems
              </label>

              <Stack spacing={1.2}>
                <DropDownNode
                  options={["Success", "Failure"]}
                  placeholder="Choose an option"
                  id={id}
                />

                <MultiSelectDropdownNode id={id} options={options} placeholder={""} value={[]} onChange={() => {}}/>
              </Stack>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CustomNode;
