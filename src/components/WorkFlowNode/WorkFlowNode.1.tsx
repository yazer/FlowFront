import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { MdArrowDropDown, MdEditDocument, MdPeopleAlt } from "react-icons/md";
import { Handle, Position, useReactFlow } from "reactflow";
import {
  deleteWorkFlowNode,
  patchWorkFlowNode,
  updateWorkFlowNode,
} from "../../apis/flowBuilder";
import { backgroundColors } from "../../utils/constants";
import EditableText from "../EditableText/EditableText";

export const WorkFlowNode: React.FC<{
  id: string;
  data: any;
  selected?: boolean;
  position?: any;
  style?: React.CSSProperties;
  type?: string;
  process?: any;
  onUserBtnClick?: any;
  onFormBtnClick?: any;
}> = ({
  id,
  data,
  selected,
  style,
  position,
  type,
  onUserBtnClick,
  onFormBtnClick,
}) => {
  const reactFlowInstance = useReactFlow();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleOnSaveLabel = async (value: string | number) => {
    const updatedNode = {
      id: id,
      data: {
        label: value,
        process: data?.process,
      },
      type,
      width: 316,
      height: 51,
    };

    await patchWorkFlowNode(updatedNode);
  };

  const handleDeleteNode = async () => {
    await deleteWorkFlowNode(id);
    reactFlowInstance.deleteElements({ nodes: [{ id: id }] });
  };

  const handleChangeColor = async (color: string) => {
    const nodes = reactFlowInstance.getNodes();
    const currentNodeIndex = nodes.findIndex((node) => node.id === id);
    const restNodes = nodes.filter((node) => node.id !== id);
    if (currentNodeIndex < 0) return;
    const currentNode = nodes[currentNodeIndex];
    currentNode.style = { ...currentNode?.style, backgroundColor: color };

    reactFlowInstance.setNodes([currentNode, ...restNodes]);
    await updateWorkFlowNode(currentNode);
  };

  return (
    <div style={loading ? { pointerEvents: "none", opacity: "0.4" } : {}}>
      <Handle position={Position.Top} type="target" />
      <Handle position={Position.Bottom} type="source" />
      <div className="flex flex-row ">
        {loading && <CircularProgress sx={{ height: "10px", width: "10px" }} />}
        <input type="text" />
        <EditableText initialValue={data.label} onSave={handleOnSaveLabel} />
        <button
          className="ml-1 px-2 hover:bg-slate-300 rounded-md"
          onClick={() => {
            onUserBtnClick(id);
          }}
        >
          <MdPeopleAlt />
        </button>
        <button
          className="ml-1 px-2 hover:bg-slate-300 rounded-md"
          onClick={() => {
            onFormBtnClick(
              reactFlowInstance.getNodes().find((node) => node.id === id)
            );
          }}
        >
          <MdEditDocument />
        </button>
      </div>

      {selected && (
        <div className="overlay">
          <div className="overlayMenu">
            <button
              className="colorDropdownBtn"
              onClick={() => setShowColorPicker((prev) => !prev)}
            >
              <div
                style={{ backgroundColor: style?.backgroundColor || "white" }}
                className="activeColor"
              />
              <MdArrowDropDown color="white" />
            </button>
            <button onClick={handleDeleteNode} className="actionBtn">
              Delete
            </button>
          </div>
          {showColorPicker && (
            <div className="colorPicker">
              {Object.keys(backgroundColors).map((color, index) => {
                return (
                  <button
                    key={`color-${index}`}
                    style={{ backgroundColor: backgroundColors[color] }}
                    className="colorVariant"
                    onClick={() => handleChangeColor(backgroundColors[color])}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
