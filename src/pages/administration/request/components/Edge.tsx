import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useReactFlow,
} from "reactflow";

export default function CustomEdge(props: any) {
  const reactFlowInstance = useReactFlow();
  const { id, sourceX, sourceY, targetX, targetY, label, type } = props;
  const edgeDetails: any = reactFlowInstance.getEdge(id);
  let status = edgeDetails?.status ?? "incompleted";

  const [label1, setLabel1] = useState(label);

  let paths: any = [];
  if (type === "AF") {
    paths = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
  }

  let [edgePath, labelX, labelY] = paths;

  useEffect(() => {
    setLabel1(label);
  }, [label]);

  const edgeStyle = {
    strokeWidth: status === "inprogress" ? 1 : 2,
    stroke:
      status === "completed"
        ? "green"
        : status === "inprogress"
        ? "#007bff"
        : "#888888", // Default color
    strokeDasharray: status === "inprogress" ? "10,10" : "none",
    animation:
      status === "inprogress" ? "dash-animation 1.5s linear infinite" : "none",
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={edgeStyle} />{" "}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${
              labelY + 15
            }px)`,
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: "120px",
          }}
        >
          <Typography
            variant="body2"
            style={{
              cursor: "pointer",
              fontWeight: 500,
              flexGrow: 1,
            }}
          >
            {label1 || "Enter Label"}
          </Typography>
        </div>
      </EdgeLabelRenderer>
      <style>
        {`
          @keyframes dash-animation {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -100;
            }
          }
        `}
      </style>
    </>
  );
}
