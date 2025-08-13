import { useCallback, useEffect, useRef, useState } from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import FlowItemsMenu from "./FlowItemsMenu/FlowItemsMenu";
import ResizableNode from "./ResizableNode/ResizableNode";
import NormalNode from "./NormalNode/NormalNode";

import "reactflow/dist/style.css";
import { customNodeTypes, CustomNodeTypes } from "../utils/customFlowItems";
import { firstSelectedNode } from "../utils/nodes";

let id = 1;
const getId = () => `flowai-${id++}`;

const nodeTypes = {
  NormalNode,
  ResizableNode,
};
interface WorkFlowBuilderProps {
  onSelectNode: (node: Node | undefined) => void;
}

const WorkFlowBuilder: React.FC<WorkFlowBuilderProps> = ({ onSelectNode }) => {
  const edgeUpdateSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useReactFlow();
  const [selectedMenuItem, setSelectedMenuItem] = useState<CustomNodeTypes>();

  const onConnect = useCallback((params: Edge<any> | Connection) => {
    const edgeAddonParams = {
      markerEnd: {
        type: MarkerType.Arrow,
        width: 15,
        height: 15,
        color: "#686b6e",
      },
      style: {
        strokeWidth: 2,
        stroke: "#686b6e",
      },
      type: "smoothstep",
    };
    setEdges((eds) => addEdge({ ...params, ...edgeAddonParams }, eds));
  }, []);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    []
  );

  const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  // useEffect(() => {
  //   const selectedNode = firstSelectedNode(nodes);
  //   onSelectNode(selectedNode);
  // }, [nodes]);

  useEffect(() => {
    const pane = reactFlowWrapper.current;
    const doubleClickDelay = 300; // Adjust the time (in milliseconds) between two clicks to consider it a double click
    let lastClickTime = 0;

    const onPaneClick = (event: React.MouseEvent) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime < doubleClickDelay) {
        if (!reactFlowWrapper.current) return;
        if (selectedMenuItem) {
          const reactFlowBounds =
            reactFlowWrapper.current.getBoundingClientRect();
          const newNode: Node = {
            ...customNodeTypes[selectedMenuItem],
            id: getId(),
            position: reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            }),
          };
          if (newNode.type === CustomNodeTypes.DEFAULT) {
            setNodes((prev) => prev.concat(newNode));
          } else {
            setNodes((prev) => [newNode].concat(prev));
          }
        }
      }
      lastClickTime = currentTime;
    };

    if (pane) {
      pane.addEventListener("click", onPaneClick as unknown as EventListener);
    }

    return () => {
      if (pane) {
        pane.removeEventListener(
          "click",
          onPaneClick as unknown as EventListener
        );
      }
    };
  }, [reactFlowInstance, selectedMenuItem, setNodes]);

  const handleSelectMenuItem = (item: CustomNodeTypes | undefined) => {
    setSelectedMenuItem(item);
  };

  return (
    <div className="w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        // nodeTypes={nodeTypes}
        onNodeDoubleClick={() => {
          const selectedNode = firstSelectedNode(nodes);
          onSelectNode(selectedNode);
        }}
        snapToGrid
        fitView
      >
        <Background color="#f6f8fa" />
        <Controls />
      </ReactFlow>
      <FlowItemsMenu onSelectItem={handleSelectMenuItem} />
    </div>
  );
};

export const WorkLayout = () => {
  const [selectedNode, setSelectedNode] = useState<Node>();

  const handleOnNodeSelect = (node: Node | undefined) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-full flex">
      <div className="flex-grow">
        <WorkFlowBuilder onSelectNode={handleOnNodeSelect} />
      </div>
      {selectedNode?.type === "NormalNode" && (
        <div className="flex-grow translate-x-0 ">
          {/* <FormBuilder selectedNode={selectedNode} /> */}
        </div>
      )}
    </div>
  );
};

export default WorkFlowBuilder;
