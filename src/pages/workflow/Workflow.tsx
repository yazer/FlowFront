/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useParams } from "react-router";
import {
  Background,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  createResizable,
  createWorkFlowEdge,
  createWorkFlowNode,
  listWorkFlowNodes,
} from "../../apis/flowBuilder";
import FlowItemsMenu from "../../components/FlowItemsMenu/FlowItemsMenu";
import FormBuilderNew from "../../components/FormBuilderNew";
import WorkFlowNode from "../../components/WorkFlowNode/WorkFlowNode";
import NodeUserList from "../../containers/NodeUserList/NodeUserList";
import { CustomNodeTypes, customNodeTypes } from "../../utils/customFlowItems";
import { firstSelectedNode } from "../../utils/nodes";
import CustomEdge from "./CustomEdge";
import ResizableNode from "./ResizableNode";

let id = 1;
const getId = () => `flowai-${id++}`;
const MIN_DISTANCE = 400;

export function WorkFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getInternalNode } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      WorkFlowNode: (props: any) => {
        return (
          <WorkFlowNode
            onUserBtnClick={onUserBtnClick}
            onFormBtnClick={onFormBtnClick}
            selectedNodeId={selectedNodeId}
            {...props}
          />
        );
      },
      ResizableNode: (props: any) => {
        return <ResizableNode {...props} />;
      },
    }),
    []
  );

  const EdgeType: any = {
    AF: (props: any) => <CustomEdge {...props} type="AF" />,
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState<
    CustomNodeTypes | undefined
  >(CustomNodeTypes.WORKFLOWNODE);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>();
  const reactFlowInstance = useReactFlow();
  const { processId } = useParams();

  const onUserBtnClick = (id: any) => {
    setSelectedNodeId((prevSelectedId) => (prevSelectedId === id ? null : id));
    setSelectedNode(null); // Ensure the form view is reset when toggling the user list.
  };

  const onFormBtnClick = (node: any) => {
    setSelectedNode((prevSelectedNode) =>
      prevSelectedNode?.id === node.id ? null : node
    );
    setSelectedNodeId(null);
  };

  const [previousNode, setPreviousNode] = useState<Node | null>(null);
  useEffect(() => {
    if (selectedNode && previousNode) {
      if (selectedNode.id === previousNode.id) {
        console.log("Clicked on the same node");
      } else {
        // code to remove the form view
        setSelectedNode(null);
        setSelectedNodeId(null);
        // code to show the form builder again
        // setSelectedNode(selectedNode);
      }
    }
    setPreviousNode(selectedNode ?? null); // Ensure previousNode is always 'null' or a valid node
  }, [selectedNode]);

  useEffect(() => {
    listworkflowNode();
  }, [processId]);

  async function listworkflowNode() {
    try {
      const data: any = await listWorkFlowNodes(processId);
      setNodes(data?.nodes);
      setEdges(data?.edges);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const pane = reactFlowWrapper.current;
    const doubleClickDelay = 300;
    let lastClickTime = 0;

    const onPaneClick = async (event: React.MouseEvent) => {
      // Prevent default pane double-click if a node is clicked
      if ((event.target as HTMLElement).closest(".react-flow__node")) {
        return;
      }

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
          setNodes((prev) => prev.concat(newNode));
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
  }, [reactFlowInstance, selectedMenuItem]);

  useEffect(() => {
    (async () => {
      const lastAddedNode = nodes[nodes.length - 1];
      if (lastAddedNode.id.startsWith("flow")) {
        const payload = { ...lastAddedNode, process: processId };

        if (lastAddedNode.type === CustomNodeTypes.WORKFLOWNODE) {
          const data = await createWorkFlowNode(payload);
          const node = [...nodes];
          node[node.length - 1] = data;
          setNodes(node);
        } else {
          await createResizable(payload);
        }
      }
    })();
  }, [nodes.length]);

  const getClosestEdge = useCallback((node) => {
    const { nodeLookup } = store.getState();
    const internalNode = getInternalNode(node.id);

    const closestNode = Array.from(nodeLookup.values()).reduce(
      (res, n) => {
        if (n.id !== internalNode.id) {
          const dx =
            n.internals.positionAbsolute.x -
            internalNode.internals.positionAbsolute.x;
          const dy =
            n.internals.positionAbsolute.y -
            internalNode.internals.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }

        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      }
    );

    if (!closestNode.node) {
      return null;
    }

    const closeNodeIsSource =
      closestNode.node.internals.positionAbsolute.x <
      internalNode.internals.positionAbsolute.x;

    return {
      id: closeNodeIsSource
        ? `${closestNode.node.id}-${node.id}`
        : `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    };
  }, []);

  const onConnect = useCallback(
    async (params: any) => {
      try {
        // Check if an edge with the same source and target already exists
        const edgeExists = edges.some(
          (edge) =>
            edge.source === params.source && edge.target === params.target
        );

        if (!edgeExists) {
          let newEdges = [
            ...edges,
            { ...params, label: "test label", type: "AF" },
          ];
          setEdges(newEdges);

          // Create workflow edge
          const data = await createWorkFlowEdge(params);

          // Add newly created edge to the edges array
          setEdges((prevEdges) => [...prevEdges, data]);
        }
      } catch (err) {
        console.log(err);
      }
      // listworkflowNode();
    },
    [edges]
  );

  const handleSelectMenuItem = (item: CustomNodeTypes | undefined) => {
    setSelectedMenuItem(item);
  };
  const [formContainerWidth, setFormContainerWidth] = useState(800);

  function handleResize(e, data) {
    setFormContainerWidth(data.size.width);
  }

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          closeEdge.className = "temp";
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge]
  );

  return (
    <>
      <div className="h-full relative flex">
        <div className={`flex-grow w-[200px] `} ref={reactFlowWrapper}>
          <ReactFlow
            // key={nodes.length}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            fitView={true}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            snapToGrid
            edgeTypes={EdgeType}
            onNodeDoubleClick={() => {
              const thisNode = firstSelectedNode(nodes);
              setSelectedNode(thisNode);
              setSelectedNodeId("");
            }}
            onEdgeClick={(event, edge) => {}}
            // code for single click
            onNodeClick={(event, node) => {
              console.log("node clicked", node);
              // code to check if clicked on a differnt node
              if (node.id !== selectedNode?.id) {
                console.log("differewntnode clicked", node);
              } else {
                console.log("same node clicked", node);
              }
            }}
          >
            <MiniMap />
            <Controls />
            <Background gap={12} size={1} />
          </ReactFlow>
          <FlowItemsMenu onSelectItem={handleSelectMenuItem} />
        </div>
        {/* {selectedNode?.type === "WorkFlowNode" && (
          <div className="w-[730px]">
            <FormBuilder
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              listworkflowNode={listworkflowNode}
            />
          </div>
        )} */}

        {selectedNode?.type === "WorkFlowNode" && (
          <ResizableBox
            width={800}
            height={0}
            // axis="x"
            resizeHandles={["w"]}
            onResize={handleResize}
            // onResizeStop={handleResize}
            minConstraints={[500, 0]}
            maxConstraints={[1200, 0]}
            handle={
              <div
                style={{
                  width: "4px",
                  cursor: "ew-resize",
                  backgroundColor: "#007bff",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />
            }
          >
            <FormBuilderNew
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              formContainerWidth={formContainerWidth}
            />
          </ResizableBox>
        )}

        {selectedNodeId && (
          <NodeUserList
            onClose={() => setSelectedNodeId("")} // This will close the sidebar
            selectedNodeId={selectedNodeId}
            show={!!selectedNodeId} // Control visibility based on selectedNodeId
            nodeName={selectedNode?.data?.label || "NAME"}
          />
        )}
        {/* <AIworkFlowIndex /> */}
      </div>
    </>
  );
}
