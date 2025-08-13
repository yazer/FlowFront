import { CircularProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import ReactFlow, {
  Background,
  MarkerType,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import { fetchAdminRequestDetails } from "../../../apis/administration";
import NodeWrapper from "../../workflow V2/NodeWrapper";
import CustomEdge from "./components/Edge";
import BranchNode from "./components/branchNode";
import WorkflowNode from "./components/workflowNode";

function RequestDetail({ requestId: requestIdProps }: any) {
  const [loader, setLoader] = useState(true);

  const { requestId = requestIdProps } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    getRequestDetails();
  }, []);

  const getRequestDetails = async () => {
    try {
      const data: any = await fetchAdminRequestDetails(requestId);
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

  const EdgeType: any = {
    AF: (props: any) => <CustomEdge {...props} type="AF" />,
  };

  return (
    <>
      {loader ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 100px)",
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      ) : (
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView={true}
            nodeTypes={nodeTypes}
            snapToGrid
            defaultEdgeOptions={defaultEdgeOptions}
            edgeTypes={EdgeType}
          >
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
      )}
    </>
  );
}

export default RequestDetail;
