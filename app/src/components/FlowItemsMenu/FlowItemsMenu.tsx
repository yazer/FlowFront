import { Redo, Undo } from "@mui/icons-material";
import React, { ReactNode, useState } from "react";
import { GoGitBranch } from "react-icons/go";
import { MdAdd, MdContentCopy, MdOutlineSpaceDashboard } from "react-icons/md";
import { CustomNodeTypes } from "../../utils/customFlowItems";
import IconButton from "../ui/IconButton";
import { IconButton as IconMuiButton } from "@mui/material";

interface FlowItemsMenuProps {
  onSelectItem: (item: CustomNodeTypes | undefined) => void;
  onUndo?: (e: any) => any;
  onRedo?: (e: any) => any;
  isUndoDisabled?: boolean;
  isRedoDisabled?: boolean;
}

interface MenuItem {
  type: CustomNodeTypes;
  icon: ReactNode;
  className: string;
}

const menuItems: MenuItem[] = [
  {
    type: CustomNodeTypes.WORKFLOWNODE,
    icon: <MdAdd />,
    className: "",
  },
  {
    type: CustomNodeTypes.WORKFLOWNODE,
    icon: <MdContentCopy />,
    className: "",
  },
  // {
  //   type: CustomNodeTypes.RESIZABLENODE,
  //   icon: <MdOutlineSpaceDashboard />,
  //   className: "",
  // },
  // {
  //   type: CustomNodeTypes.BRANCHNODE,
  //   icon: (
  //     <GoGitBranch
  //       style={{
  //         transform: "rotate(45deg)", // Rotates the icon by 45 degrees
  //       }}
  //     />
  //   ),
  //   className: "",
  // },
  // {
  //   type: CustomNodeTypes.NOTIFICATIONNODE,
  //   icon: <MdOutlineNotificationAdd />,
  //   className: "",
  // },
];

const FlowItemsMenu: React.FC<FlowItemsMenuProps> = ({
  onSelectItem,
  onUndo = () => {},
  onRedo = () => {},
  isUndoDisabled,
  isRedoDisabled,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(0);

  const onDragStart = (event: React.DragEvent, nodeType: CustomNodeTypes) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSelectItem = (index: number, itemType: CustomNodeTypes) => {
    setSelectedIndex((prev) => (prev === index ? undefined : index));
    onSelectItem(index === selectedIndex ? undefined : itemType);
  };

  return (
    <div className="absolute left-4 top-4 shadow bg-white w-14 z-10">
      <aside>
        <div className="w-full flex flex-col gap-2 items-center p-2">
          {menuItems.map((item, index) => {
            return (
              <div
                key={`menu-item-${index}`}
                className="input"
                title={item.type}
                onDragStart={(event) => onDragStart(event, item.type)}
                onClick={() => handleSelectItem(index, item.type)}
              >
                <div draggable>
                  <IconButton selected={selectedIndex === index}>
                    {item.icon}
                  </IconButton>
                </div>
              </div>
            );
          })}
          <IconMuiButton
            disabled={isUndoDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onUndo(e);
            }}
            size="small"
          >
            <Undo />
          </IconMuiButton>
          <IconMuiButton
            disabled={isRedoDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onRedo(e);
            }}
            size="small"
          >
            <Redo />
          </IconMuiButton>
        </div>
      </aside>
    </div>
  );
};

export default FlowItemsMenu;
