import { Check, Delete, Edit } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeTypes,
  SmoothStepEdge,
  getBezierPath,
  getStraightPath,
  useReactFlow,
} from "reactflow";
import { deleteWorkFlowEdge, updateWorkFlowEdge } from "../../apis/flowBuilder";

export default function CustomEdge(props: any) {
  const { id, sourceX, sourceY, targetX, targetY, label, type } = props;

  const [edit, setEdit] = useState(false);
  const [label1, setLabel1] = useState(label);
  const reactFlowInstance = useReactFlow();

  let paths: any = [];

  if (type === "AF") {
    paths = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  }

  let [edgePath, labelX, labelY] = paths;

  function changelabel(e: any) {
    setLabel1(e.target.value);
  }

  async function updateEdge() {
    const data = await updateWorkFlowEdge({
      ...props,
      label: label1,
    });
  }

  async function deleteEdge() {
    try {
      const data: any = await deleteWorkFlowEdge(props.id);
      reactFlowInstance.deleteElements({ edges: [{ id }] });
    } catch (err) {
      console.log(err);
    }
  }

  function enterkey(e: any) {
    if (e.key === "Enter") {
      updateEdge();
      setEdit(false);
    }
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} />{" "}
      <EdgeLabelRenderer>
        <Stack
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          alignItems="center"
          direction="row"
        >
          {edit ? (
            <>
              <input
                type="text"
                value={label1}
                onChange={changelabel}
                onKeyDown={enterkey}
              />
              <IconButton
                className="nodrag nopan"
                onClick={() => {
                  updateEdge();
                  setEdit(false);
                }}
              >
                <Check />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h6">{label1}</Typography>
              <IconButton title="Edit label" onClick={() => setEdit(true)}>
                <Edit />
              </IconButton>
              <IconButton title="Delete" onClick={deleteEdge}>
                <Delete />
              </IconButton>
            </>
          )}
        </Stack>
      </EdgeLabelRenderer>
    </>
  );
}
