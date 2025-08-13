import ReactFlow, {
  Background,
  MarkerType,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import { useEffect, useMemo, useState } from "react";
import WorkflowNode from "./components/workflowNode";
import BranchNode from "./components/branchNode";
import NodeWrapper from "../../NodeWrapper";
import { getTemplateProcessDetails } from "../../../../apis/flowBuilder";
import CustomEdge from "./components/customEdge";
import { CircularProgress } from "@mui/material";

function WorkflowPreview({ templateId }: { templateId: string | null }) {
  const [loader, setLoader] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchTemplateDetails();
  }, []);

  const fetchTemplateDetails = async () => {
    setLoader(true);
    try {
      // const data: any = await listWorkFlowNodes(
      //   "c74e0e48-ad63-4e55-8117-05c6032e857e"
      // );
      const data: any = await getTemplateProcessDetails(templateId ?? "");
      setNodes(data?.nodes);
      setEdges(data?.edges);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const nodeTypes = useMemo(
    () => ({
      WorkFlowNode: (props: any) => {
        return (
          <NodeWrapper>
            <WorkflowNode {...props} />
          </NodeWrapper>
        );
      },
      BranchNode: (props: any) => {
        return (
          <NodeWrapper>
            <BranchNode {...props} />
          </NodeWrapper>
        );
      },
    }),
    []
  );

  const defaultEdgeOptions = {
    type: "floating",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#b1b1b7",
    },
  };

  const EdgeType: any = useMemo(
    () => ({
      AF: (props: any) => <CustomEdge {...props} type="AF" />,
    }),
    []
  );

  return (
    <div
      style={{
        height: "calc(100vh - 100px)",
        width: "100%",
      }}
    >
      {loader ? (
        <div className="flex items-center justify-center h-[90%]">
          <CircularProgress
            sx={{ height: "20px", width: "20px" }}
          ></CircularProgress>
        </div>
      ) : (
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={EdgeType}
            fitView={true}
            nodeTypes={nodeTypes}
            snapToGrid
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      )}
    </div>
  );
}

export default WorkflowPreview;
