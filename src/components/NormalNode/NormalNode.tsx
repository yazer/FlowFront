import { memo, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import "./normal-node.scss";
import { MdArrowDropDown } from "react-icons/md";
import { backgroundColors } from "../../utils/constants";
import EditableText from "../EditableText/EditableText";
import { deleteOrgPosition, updateOrgPosition } from "../../apis/organization";

const NormalNode: React.FC<{
  id: string;
  data: any;
  selected?: boolean;
  position?: any;
  style?: React.CSSProperties;
  type?: string;
}> = ({ id, data, selected, style, position, type }) => {
  const reactFlowInstance = useReactFlow();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleOnSaveLabel = async (value: string | number) => {
    const updatedNode = {
      id: id,
      data: {
        label: value,
      },
      type,
      width: 316,
      height: 51,
    };
    await updateOrgPosition(updatedNode);
  };

  const handleDeleteNode = async () => {
    await deleteOrgPosition(id);
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
  };

  return (
    <>
      <Handle position={Position.Top} type="target" />
      {/* <Handle position={Position.Left} type="source" /> */}
      <Handle position={Position.Bottom} type="source" />
      {/* <Handle position={Position.Right} type="source" /> */}
      <EditableText initialValue={data.label} onSave={handleOnSaveLabel} />
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
    </>
  );
};

export default memo(NormalNode);
