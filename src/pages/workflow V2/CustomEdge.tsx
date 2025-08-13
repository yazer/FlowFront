import { Delete } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { FormattedMessage, useIntl } from "react-intl";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  useReactFlow,
} from "reactflow";
import * as Yup from "yup";
import { deleteWorkFlowEdge, updateWorkFlowEdge } from "../../apis/flowBuilder";
import DialogCustomized from "../../components/Dialog/DialogCustomized";
import useTranslation from "../../hooks/useTranslation";
import EdgeLanguageForm from "./edgeLangForm";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Flow name is required"),
});

interface FormDataType {
  [key: string]: {
    name: string;
  };
}

function CustomEdge(props: any) {
  const { id, sourceX, sourceY, targetX, targetY, type, data, setIsDrag } =
    props;

  const { locale } = useIntl();

  const [isEditing, setIsEditing] = useState(false);
  const [label1, setLabel1] = useState("");
  const reactFlowInstance = useReactFlow();
  const { translate } = useTranslation();

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
  const radiusX = Math.abs(sourceX - targetX) * 0.6;
  const radiusY = Math.abs(sourceY - targetY) * 0.6 + 50;

  const largeArcFlag = sourceX === targetX ? 0 : 1;

  const reconnectedgePath = `M ${
    sourceX - 5
  } ${sourceY} A ${radiusX} ${radiusY} 0 ${largeArcFlag} ${0} ${
    targetX + 2
  } ${targetY}`;

  const labelXReverse = (sourceX + targetX) / 2;
  const labelYReverse = Math.min(sourceY, targetY) - 100;

  const isReverseEdge = useMemo(() => {
    const sourceNode = reactFlowInstance.getNode(props.source);
    const targetNode = reactFlowInstance.getNode(props.target);

    if (!sourceNode || !targetNode) return false;

    // Check if target is to the left of the source
    return targetNode.position.x < sourceNode.position.x;
  }, [reactFlowInstance, props.source, props.target]);
  const LabelX = isReverseEdge ? labelXReverse : labelX;
  const LabelY = isReverseEdge ? labelYReverse : labelY;

  useEffect(() => {
    setLabel1(data?.translations?.[locale]?.name);
  }, [data?.translations, locale]);

  function handleLabelChange(e: any) {
    e.stopPropagation();
    setLabel1(e.target.value);
  }

  async function updateEdge() {
    reactFlowInstance.setEdges(
      reactFlowInstance.getEdges().map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                translations: {
                  ...node.data.translations,
                  [locale]: { name: label1 },
                },
              },
            }
          : node
      )
    );
    await updateWorkFlowEdge({
      ...props,
      translations: {
        ...data.translations,
        [locale]: { name: label1 },
      },
    });
    reactFlowInstance.setEdges(
      reactFlowInstance.getEdges().map((node: any) =>
        node.id === id
          ? {
              ...node,
              // data: {
              // ...node.data,
              translations: {
                ...node.data.translations,
                [locale]: { name: label1 },
              },
            }
          : node
      )
    );
  }

  async function deleteEdge() {
    try {
      setIsDrag(true);
      await deleteWorkFlowEdge(id);
      reactFlowInstance.deleteElements({ edges: [{ id }] });
    } catch (err) {
      console.log(err);
    } finally {
      setIsDrag(true);
    }
  }

  function handleKeyDown(e: any) {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.stopPropagation();
      updateEdge();
      setIsEditing(false);
      setIsDrag(true);
    }
  }

  function handleBlur() {
    updateEdge();
    setIsEditing(false);
    setIsDrag(true);
  }
  const formik = useFormik({
    initialValues: { language: locale, name: "", description: "" },
    validationSchema,
    onSubmit: (values) => {
      setIsEditLangForm(false);
      setFormData((state) => ({ ...state, [values.language]: values }));
    },
  });

  const [submitLoader, setSubmitLoader] = useState(false);

  const [isEditLangForm, setIsEditLangForm] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    en: { name: "" },
    ar: { name: "" },
  });

  const submitLanguage = async () => {
    try {
      await updateWorkFlowEdge({
        ...props,
        data: undefined,
        translations: { ...formData },
      });

      reactFlowInstance.setEdges(
        reactFlowInstance.getEdges().map((node: any) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  translations: { ...formData },
                },
              }
            : node
        )
      );
    } catch (error) {
    } finally {
      setSubmitLoader(false);
    }
  };

  useEffect(() => {
    formik.setFieldValue(
      "name",
      formData?.[formik.values.language || (locale as any)]?.name ?? ""
    );
    if (!formik.values.language) {
      formik.setFieldValue("language", locale);
    }
  }, [formik.values.language, formData]);

  useEffect(() => {
    setFormData(data?.translations);
  }, [data?.translations]);

  return (
    <>
      <DialogCustomized
        content={
          <EdgeLanguageForm
            formik={formik}
            isEdit={isEditLangForm}
            setIsEdit={setIsEditLangForm}
            formData={formData}
            setFormData={setFormData}
          />
        }
        title="Title"
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
          setSubmitLoader(false);
        }}
        actions={
          !isEditLangForm ? (
            <Stack>
              <Button
                disabled={submitLoader}
                variant="contained"
                onClick={() => {
                  setSubmitLoader(true);
                  setDialogOpen(false);
                  setIsEditLangForm(true);
                  formik.resetForm();
                  formik.setValues({ name: "", description: "", language: "" });
                  submitLanguage();
                }}
              >
                <FormattedMessage id="done"></FormattedMessage>
              </Button>
            </Stack>
          ) : null
        }
      />
      {isReverseEdge ? (
        <BaseEdge
          id={id}
          path={reconnectedgePath}
          style={{
            strokeWidth: 2,
          }}
        />
      ) : (
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            strokeWidth: 2,
          }}
        />
      )}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${LabelX}px, ${
              LabelY + 15
            }px)`,
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minWidth: "120px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
            setIsDrag(false);
          }}
        >
          {isEditing ? (
            <InputBase
              value={label1}
              onChange={handleLabelChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              fullWidth
              style={{
                fontSize: "0.9rem",
                padding: "2px",
                borderBottom: "1px solid #ccc",
              }}
            />
          ) : (
            <Typography
              variant="body2"
              style={{
                cursor: "pointer",
                fontWeight: 500,
                flexGrow: 1,
              }}
            >
              {label1 || translate("enterLabel")}
              {/* {label1 || <FormattedMessage id="enterLabel" />} */}
            </Typography>
          )}
          <IconButton size="small" onClick={deleteEdge}>
            <Delete fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={() => setDialogOpen(true)}>
            <MdLanguage />
          </IconButton>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default React.memo(CustomEdge);
