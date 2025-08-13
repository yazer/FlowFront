/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import isEqual from "lodash/isEqual";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
  MdArrowDropDown,
  MdEditDocument,
  MdLanguage,
  MdNotifications,
  MdOutlineShare,
  MdPeopleAlt,
} from "react-icons/md";
import { FormattedMessage, useIntl } from "react-intl";
import { Handle, NodeResizer, Position, useReactFlow } from "reactflow";
import * as Yup from "yup";
import {
  deleteWorkFlowNode,
  patchWorkFlowNode,
  updateWorkFlowNode,
} from "../../apis/flowBuilder";
import useTranslation from "../../hooks/useTranslation";
import { backgroundColors } from "../../utils/constants";
import DialogCustomized from "../Dialog/DialogCustomized";
import "./workflow-node.scss";
import WorkflowLanguageForm from "./WorkflowLanguageForm";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Flow name is required"),
});

const CustomTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
  background: "#f8f5f5",
  borderRadius: "6px",
  minHeight: 29,
  "& .MuiTabs-flexContainer": {
    // background: "linear-gradient(83.2deg, #121212 6.52%, #202020 118.43%)",
    // border: "0.5px solid #494949",
    // width: "fit-content",
    padding: "4px 4px 4px 4px",
    // borderRadius: "16px",
    // boxShadow: "0px 0px 20px 0px #00000080 inset",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  cursor: "pointer",
  textTransform: "none",
  minHeight: 30,
  height: "34px",
  borderRadius: "4px 4px 4px 4px",
  padding: "6px 8px 10px 8px",
  width: "50%",
  [theme.breakpoints.up("sm")]: {
    minWidth: 110,
  },
  fontSize: "1rem",
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.secondary,
  "&:hover": {
    opacity: 3,
    color: theme.palette.text.primary,
  },
  "&.Mui-selected": {
    // paddingBottom: "8px",
    color: theme.palette.text.primary,
    background: "#ffffff",
    border: "1px solid #e0e0e0",
  },
  "&.Mui-focusVisible": {
    // backgroundColor: "#d1eaff",
  },
  transition: "all 0.3s ease",
}));

type NotificationPayload = {
  notification_id: string;
  edge_uuid: string;
  method_uuid: string[];
  description: string;
  staff_list: string[];
  group_uuid: string[];
  workflow_users: string[];
};

interface FormDataType {
  [key: string]: {
    name: string;
    description: string;
  };
}

const WorkFlowNode: React.FC<{
  id: string;
  data: any;
  selected?: boolean;
  position?: any;
  style?: React.CSSProperties;
  type?: string;
  process?: any;
  onUserBtnClick?: any;
  onFormBtnClick?: any;
  selectedNodeId?: string;
  setIsDrag?: any;
  groups: any;
  workflowList: any;
  masterNotificationList: any;
  onNotificationClick: (data: any) => void;
  setSelectedNode: any;
}> = ({
  id,
  data,
  selected,
  style,
  type,
  onUserBtnClick,
  onFormBtnClick,
  selectedNodeId,
  setIsDrag,
  groups,
  workflowList,
  masterNotificationList,
  onNotificationClick,
  setSelectedNode,
}) => {
  const reactFlowInstance = useReactFlow();
  const nodeDetails = reactFlowInstance.getNode(id);

  const { locale } = useIntl();
  const { notifications }: { notifications: NotificationPayload[] } = data;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [workflowTab, setworkflowTab] = useState("description");

  const [isDeleting, setIsDeleting] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);

  const [isEditLangForm, setIsEditLangForm] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    en: { name: "", description: "" },
    ar: { name: "", description: "" },
  });
  const { translate } = useTranslation();

  const updateNodeNotifications = async (
    notifications: NotificationPayload[],
    isUpdateAPI: boolean = true
  ) => {
    const updatedNode = {
      ...nodeDetails,
      id: id,
      data: {
        ...nodeDetails?.data,
        notifications: notifications,
      },
    };
    if (isUpdateAPI) {
      await updateWorkFlowNode(updatedNode);
    }
    reactFlowInstance.setNodes(
      reactFlowInstance
        .getNodes()
        .map((node: any) =>
          node.id === id
            ? { ...node, data: { ...data, notifications: notifications } }
            : node
        )
    );
  };

  const handleOnSaveLabel = async (value: string | number) => {
    const updatedNode = {
      id: id,
      data: {
        // label: value,
        process: data?.process,
        translations: { ...data.translations, [locale]: { name: value } },
      },
      type,
      width: 316,
      height: 51,
    };
    try {
      await patchWorkFlowNode(updatedNode);
      reactFlowInstance.setNodes(
        reactFlowInstance.getNodes().map((node: any) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...data,
                  translations: updatedNode.data.translations,
                },
              }
            : node
        )
      );
      setSelectedNode(updatedNode);
    } catch (error) {
      toast.error("Ensure this field has no more than 256 characters");
    }
  };

  const handleDeleteNode = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkFlowNode(id);
      reactFlowInstance.deleteElements({ nodes: [{ id }] });
      setIsDeleting(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeColor = async (color: string) => {
    const currentNodeIndex = reactFlowInstance
      .getNodes()
      .findIndex((node: any) => node.id === id);
    const restNodes = reactFlowInstance
      .getNodes()
      .filter((node: any) => node.id !== id);
    if (currentNodeIndex < 0) return;

    const currentNode = reactFlowInstance.getNodes()[currentNodeIndex];
    currentNode.style = { ...currentNode?.style, backgroundColor: color };

    reactFlowInstance.setNodes([currentNode, ...restNodes]);
    await updateWorkFlowNode(currentNode);
  };

  const handleChangeMultiSelect = (id: string, name: string, value: any) => {
    type NameKeys =
      | "staff_list"
      | "method_uuid"
      | "workflow_users"
      | "group_uuid";

    let updatedValue = notifications.map((item) =>
      item.notification_id === id
        ? {
            ...item,
            [name]: (item[name as NameKeys] ?? []).includes(value)
              ? (item[name as NameKeys] ?? []).filter(
                  (i: string) => i !== value
                )
              : [...(item[name as NameKeys] ?? []), value],
          }
        : item
    );
    updateNodeNotifications(updatedValue);
  };

  const handleChangeTreeView = (id: string, value: any) => {
    let updatedValue = notifications.map((item) =>
      item.notification_id === id
        ? {
            ...item,
            ...value,
            group_uuid:
              value?.group_uuid?.[0] === "group_uuid"
                ? value?.group_uuid?.slice(1) ?? []
                : value?.group_uuid ?? [],
            staff_list:
              value?.staff_list?.[0] === "staff_list"
                ? value?.staff_list?.slice(1) ?? []
                : value?.staff_list ?? [],
            workflow_users:
              value?.workflow_users?.[0] === "workflow_users"
                ? value?.workflow_users?.slice(1) ?? []
                : value?.workflow_users ?? [],
          }
        : item
    );

    if (!isEqual(notifications, updatedValue)) {
      updateNodeNotifications(updatedValue);
    }
  };

  const handleAddNotification = () => {
    let temp =
      notifications && Array.isArray(notifications) ? [...notifications] : [];
    const newNotification: NotificationPayload = {
      notification_id: `${Date.now()}`,
      edge_uuid: "",
      staff_list: [],
      method_uuid: [],
      description: "",
      group_uuid: [],
      workflow_users: [],
    };

    updateNodeNotifications([...temp, newNotification]);
  };

  const handleChange = (id: string, name: string, value: any) => {
    let updatedValue = notifications.map((item) =>
      item.notification_id === id
        ? {
            ...item,
            [name]: value,
          }
        : item
    );

    updateNodeNotifications(updatedValue);
  };

  const handleDeleteNotification = (id: string) => {
    let updatedValue = notifications.filter(
      (item) => item.notification_id !== id
    );
    updateNodeNotifications(updatedValue);
  };

  const submitLanguage = async () => {
    const updatedNode = {
      id: id,
      data: {
        process: data?.process,
        translations: formData,
      },
      type,
      width: 316,
      height: 51,
    };
    try {
      await patchWorkFlowNode(updatedNode);
      reactFlowInstance.setNodes(
        reactFlowInstance.getNodes().map((node: any) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...data,
                  translations: updatedNode.data.translations,
                },
              }
            : node
        )
      );
    } catch (error) {
      toast.error("Ensure this field has no more than 256 characters");
    } finally {
      setSubmitLoader(false);
    }
  };

  const formik = useFormik({
    initialValues: { language: locale, name: "", description: "" },
    validationSchema,
    onSubmit: (values) => {
      setIsEditLangForm(false);
      setFormData((state) => ({ ...state, [values.language]: values }));
    },
  });

  useEffect(() => {
    formik.setFieldValue(
      "name",
      formData?.[formik.values.language || (locale as any)]?.name
    );

    formik.setFieldValue(
      "description",
      formData?.[formik.values.language || (locale as any)]?.description
    );

    if (!formik.values.language) {
      formik.setFieldValue("language", locale);
    }
  }, [formik.values.language, formData]);

  useEffect(() => {
    setFormData(data?.translations);
  }, [data?.translations]);

  return (
    <div>
      {isDeleting && (
        <Box
          sx={{
            position: "absolute",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            width: "95%",
            backgroundColor: "White",
          }}
        >
          Deleting...
        </Box>
      )}
      <DialogCustomized
        content={
          <WorkflowLanguageForm
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
      <NodeResizer
        isVisible={false} // Show resizer only when the node is selected
        minWidth={200} // Minimum width for resizing
        maxWidth={500} // Maximum width for resizing
        minHeight={36} // Fix height
        maxHeight={36} // Fix height
        keepAspectRatio={false} // Allow free resizing
        lineClassName="custom-resizer-line" // Custom class for resizer line
        handleClassName="custom-resizer-handle" // Custom class for resizer handle
        // onResize={(event, params) => {
        //   setNodeWidth(params.width); // Update width dynamically
        // }}
        onResizeEnd={(event, params) => {
          // setNodeWidth(params.width); // Finalize the width update
        }}
      />
      {/* <Handle position={Position.Top} type="target" className="custom_handle" isConnectableStart={false}></Handle> */}
      <Handle position={Position.Left} type="target" />
      <Handle position={Position.Right} type="source" />
      <div className="flex flex-row justify-between items-center gap-4">
        <Stack direction="row" gap={1} alignItems="center" flex={1}>
          <MdOutlineShare color="blue" />
          <div
            onClick={() => {
              setIsDrag(false);
              setIsEdit(true);
            }}
            onBlur={() => {
              setIsDrag(true);
              setIsEdit(false);
            }}
            style={{ flex: 1 }}
          >
            {isEdit ? (
              <TextField
                defaultValue={data?.translations?.[locale]?.name}
                autoFocus
                variant="standard"
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "#333",
                  },
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  reactFlowInstance.setNodes(
                    reactFlowInstance.getNodes().map((node: any) =>
                      node.id === id
                        ? {
                            ...node,
                            data: {
                              ...data,
                              translations: {
                                ...data.translations,
                                [locale]: { name: e.target.value },
                              },
                            },
                          }
                        : node
                    )
                  );
                }}
                inputProps={{ style: { height: "15px", width: "180px" } }}
                onKeyDown={(e) => {
                  if (e?.key === "Enter") {
                    setIsEdit(false);
                    handleOnSaveLabel(data?.translations?.[locale]?.name);
                  }
                }}
                onBlur={(e) => {
                  setIsEdit(false);
                  handleOnSaveLabel(e.target.value);
                }}
              />
            ) : (
              <Tooltip title={data?.translations?.[locale]?.name ?? ""}>
                <Typography
                  variant="subtitle1"
                  width="180px"
                  color={
                    data?.translations?.[locale]?.name ? "black" : "#b7b7b7"
                  }
                  noWrap={true}
                >
                  {data?.translations?.[locale]?.name || translate("enterName")}
                </Typography>
              </Tooltip>
            )}
          </div>
        </Stack>
        <div className="flex flex-row justify-center items-center">
          <button
            className="ml-1 p-1 hover:bg-slate-300 rounded-md"
            onClick={() => {
              setIsMinimized(!isMinimized);
            }}
            // title={isMinimized ? "Expand Details" : "Collapse Details"}
          >
            {isMinimized ? <AiOutlinePlus /> : <AiOutlineMinus />}
          </button>
          <button
            className="ml-1 p-1 hover:bg-slate-300 rounded-md"
            onClick={() => {
              setDialogOpen(true);
            }}
            title={"Translation"}
          >
            <MdLanguage />
          </button>

          <button
            className="ml-1 p-1 hover:bg-slate-300 rounded-md"
            onClick={() => {
              if (
                reactFlowInstance
                  ?.getEdges()
                  // @ts-ignore
                  ?.find((dat: any) => dat.source === id)?.uuid
              ) {
                onNotificationClick(nodeDetails);
              } else {
                toast.error("Please connect with nodes for add notifications");
              }
            }}
            // title={isMinimized ? "Expand Details" : "Collapse Details"}
          >
            {<MdNotifications />}
          </button>
          <button
            className="ml-1 p-1 hover:bg-slate-300 rounded-md"
            onClick={() => {
              // onUserBtnClick(selectedNodeId === id ? null : id);
              onUserBtnClick(id, nodeDetails);
            }}
          >
            <MdPeopleAlt />
          </button>
          <button
            className="ml-1 p-1 hover:bg-slate-300 rounded-md"
            onClick={() => {
              onFormBtnClick(
                reactFlowInstance.getNodes().find((node) => node.id === id)
              );
            }}
          >
            <MdEditDocument />
          </button>
        </div>
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
              <FormattedMessage id="delete" />
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
      {!isMinimized && (
        <>
          <Box height="8px"></Box>

          <Box height="8px"></Box>
          {/* <CustomTabs
            value={workflowTab}
            onChange={(e: any, value: string) => setworkflowTab(value)}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <CustomTab value="description" label="Description" />
            <CustomTab value="notification" label="Notification" />
          </CustomTabs> */}
          <span className="text-gray-700 text-sm font-medium">
            <FormattedMessage id="description"></FormattedMessage> :
          </span>
          <>
            <div
              style={{
                transition: "opacity 0.3s ease",
                marginTop: "5px",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative",
                minHeight: "130px",
              }}
            >
              <textarea
                style={{
                  height: "100%",
                  width: "100%",
                  outline: "none",
                }}
                rows={5}
              ></textarea>
            </div>
          </>
        </>
      )}
    </div>
  );
};

export default memo(WorkFlowNode);
