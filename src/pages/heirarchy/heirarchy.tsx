import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import FlowItemsMenu from "../../components/FlowItemsMenu/FlowItemsMenu";
import { CustomNodeTypes } from "../../utils/customFlowItems";
import NormalNode from "../../components/NormalNode/NormalNode";
import {
  createOrgPosition,
  createOrgPositionEdge,
  deleteEdge,
  updateOrgPosition,
} from "../../apis/organization";
import { ORGANIZATION_HEIRARCHY } from "../../apis/urls";

// const nodeTypes = {
//   NormalNode,
// };

export function Herirarchy() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<CustomNodeTypes>();
  const [lastClickTime, setLastClickTime] = useState(0);

  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const reactFlowInstance = useReactFlow();

  const nodeTypes = useMemo(() => ({ NormalNode }), []);

  useEffect(() => {
    const url = `${ORGANIZATION_HEIRARCHY}?format=json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setNodes(data?.nodes);
        setEdges(data?.edges);
      });
  }, []);

  useEffect(() => {
    const pane = reactFlowWrapper.current;
    const doubleClickDelay = 300;

    const onPaneClick = async (event: React.MouseEvent) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime < doubleClickDelay) {
        if (!reactFlowWrapper.current) return;
        if (selectedMenuItem) {
          const newNode = await createOrgPosition(
            reactFlowInstance,
            reactFlowWrapper,
            event
          );

          setNodes((prev) => prev.concat(newNode));
        }
      }
      setLastClickTime(currentTime);
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
  }, [reactFlowInstance, selectedMenuItem]);

  const onConnect = useCallback(
    async (params: any) => {
      const res = await createOrgPositionEdge(params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

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
        onEdgesDelete={async (edges: Edge[]) => {
          deleteEdge(edges[0]?.id);
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeDragStop={async (event: React.MouseEvent, node: Node) => {
          await updateOrgPosition(node);
        }}
        snapToGrid
        fitView
      >
        {/* <Controls /> */}

        <Background gap={12} size={1} />
      </ReactFlow>
      <FlowItemsMenu onSelectItem={handleSelectMenuItem} />
    </div>
  );
}
