import { KeyboardEvent, memo, useState } from "react";
import { MdArrowDropDown, MdCheck, MdEdit } from "react-icons/md";
import { NodeResizer, useReactFlow } from "reactflow";
import { deleteResizableNode } from "../../apis/flowBuilder";
import { backgroundColors } from "../../utils/constants";
import "./resizable-node.scss";

const ResizableNode: React.FC<{
  id: string;
  data: any;
  selected?: boolean;
  style?: React.CSSProperties;
}> = ({ id, data, selected, style }) => {
  const reactFlowInstance = useReactFlow();

  const [label, setLabel] = useState(data.label);
  const [isLabelEditMode, setIsLabelEditMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleClickEditLabel = () => {
    setIsLabelEditMode(true);
  };

  const handleClickSaveLabel = () => {
    setIsLabelEditMode(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement> | undefined) => {
    if (e?.key === "Enter") {
      handleClickSaveLabel();
    }
  };

  const handleDeleteNode = async () => {
    await deleteResizableNode(id);
    reactFlowInstance.deleteElements({ nodes: [{ id: id }] });
  };

  const handleChangeColor = (color: string) => {
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
      <NodeResizer isVisible={selected} minWidth={100} minHeight={30} />

      <div className="labelContainer">
        <input
          disabled={!isLabelEditMode}
          autoFocus
          value={label}
          onKeyDown={handleKeyDown}
          onChange={(e) => setLabel(e.target.value)}
        />
        {isLabelEditMode ? (
          <button onClick={handleClickSaveLabel}>
            <MdCheck />
          </button>
        ) : (
          <button onClick={handleClickEditLabel}>
            <MdEdit />
          </button>
        )}
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
    </>
  );
};

export default memo(ResizableNode);
