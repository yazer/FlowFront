/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import Save from "@mui/icons-material/Save";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FiAlertCircle } from "react-icons/fi";
import { LuDiamond } from "react-icons/lu";
import {
  MdOutlineNotificationAdd,
  MdOutlineShare,
  MdOutlineSpaceDashboard,
  MdPublish,
} from "react-icons/md";
import { FormattedMessage, useIntl } from "react-intl";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useParams } from "react-router";
import {
  Background,
  ConnectionLineType,
  ConnectionMode,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  applyTemplate,
  createResizable,
  createTemplateFlow,
  createWorkFlowEdge,
  createWorkFlowNode,
  deleteWorkFlowEdge,
  deleteWorkFlowNode,
  getNotificationHeirarchyList,
  getProcessVersionList,
  getTemplateList,
  getUserGroups,
  getWorkflowNodes,
  listWorkFlowNodes,
  PostPublishProcess,
  updateWorkFlowEdge,
  updateWorkFlowNode,
} from "../../apis/flowBuilder";
import { fetchProcessDetails } from "../../apis/process";
import DialogCustomized from "../../components/Dialog/DialogCustomized";
import FlowItemsMenu from "../../components/FlowItemsMenu/FlowItemsMenu";
import FormBuilderNew from "../../components/FormBuilderNew";
import CheckBox from "../../components/FormElements/components/CheckBox";
import InputField from "../../components/FormElements/components/InputField";
import WorkFlowNode from "../../components/WorkFlowNode/WorkFlowNode";
import NotificationDrawer from "../../containers/nodeNotificationDrawer/notificationDrawer";
import NodeUserList from "../../containers/NodeUserList/NodeUserList";
import useTranslation from "../../hooks/useTranslation";
import {
  CustomNodeTypes,
  customNodeTypes,
  CustomNodeTypesOptions,
} from "../../utils/customFlowItems";
import AIChatBox from "./AIChatBox";
import BranchNode from "./BranchNode";
import CustomEdge from "./CustomEdge";
import NodeWrapper from "./NodeWrapper";
import ProcessDetailsMenu from "./ProcessDetailsMenu";
import ResizableNode from "./ResizableNode";
import "./workflow.css";
import WorkFlowTemplate from "./workflowTemplate/index";
import { postMethod } from "../../apis/ApiMethod";
import { GET_INTELLECTA_FORM } from "../../apis/urls";
import ReportGenerator from "../reportPdf/ReportGenerator";

let id = 1;
const getId = () => `flowai-${id++}`;

const idMap = new Map<string, string>();

export type selectedCompType =
  | "formBuilder"
  | "formPreview"
  | "reportGenerator";

const templateTemplate = {
  name: "",
  is_organization: false,
  is_global: false,
  description: "",
};

export default function WorkFlow() {
  const { processId } = useParams();

  const { locale } = useIntl();
  const { translate } = useTranslation();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [formOpen, setFormOpen] = useState(false);

  const [templateDialog, setTemplateDialog] = useState(false);
  const [confirmTemplate, setConfirmTemplate] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const [formContainerWidth, setFormContainerWidth] = useState(800);
  const [processDetails, setProcessDetails] = useState({});
  const [isDrag, setIsDrag] = useState(true);

  const [groups, setGroups] = useState([]);
  const [workflowList, setworkflowList] = useState([]);
  const [masterNotificationList, setMasterNotificationList] = useState([]);

  const [selectedComponent, setSelectedComponent] =
    useState<selectedCompType>("formBuilder");

  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  const [publishDialog, setPublishDialog] = useState(false);
  const [publishForm, setpublishForm] = useState({
    version: "",
    comments: "",
  });
  const [versionError, setversionError] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);

  const [loader, setLoader] = useState(true);
  const [templateLoader, setTemplateLoader] = useState(false);
  const [openNotification, setOpenNotification] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>();

  const [selectedMenuItem, setSelectedMenuItem] = useState<
    CustomNodeTypes | undefined
  >(CustomNodeTypes.WORKFLOWNODE);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>();
  const reactFlowInstance = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });

  const [versionList, setVersionList] = useState([]);
  const [previousNode, setPreviousNode] = useState<Node | null>(null);

  const [isVisible, setisVisible] = useState(false);
  const [publishLoader, setPublishLoader] = useState(false);
  const [fullScreenWidth, setFullScreenWidth] = useState(0);
  const [templateForm, setTemplateForm] = useState<any>(templateTemplate);
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState<null | string>(null);

  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);

  // Form builder related states
  const [formBuilderloading, setFormBuilderLoading] = useState(true);
  const [aiGeneratedForm, setAiGeneratedForm] = useState<any>(null);

  const selectedNodes = nodes.filter((node) => node.selected);

  const fetchWorflowNodes = async () => {
    try {
      const res = await getWorkflowNodes(processId);
      setworkflowList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotificationHeirarchyList = async () => {
    try {
      const res = await getNotificationHeirarchyList("");
      let data = [
        {
          id: "workflow_users",
          label: "Workflow users",
          children: res?.workflow?.map((item: any) => ({
            label: item?.translations?.[locale]?.name,
            id: item?.uuid,
          })),
        },
        {
          id: "group_uuid",
          label: "Groups",
          children: res?.groups?.map((item: any) => ({
            label: item?.translations?.[locale]?.name,
            id: item?.id,
          })),
        },
        {
          id: "staff_list",
          label: "Users",
          children: res?.staff_list?.map((item: any) => ({
            label: item?.translations?.[locale]?.name,
            id: item?.uuid,
          })),
        },
      ];
      setMasterNotificationList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserGroups = async () => {
    try {
      const res = await getUserGroups();
      setGroups(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorflowNodes();
    fetchUserGroups();
    fetchNotificationHeirarchyList();
    setSwitchLoading(false);
    fetchTemplateList();
  }, []);

  async function fetchTemplateList() {
    try {
      const res = await getTemplateList();
      setTemplateList(res);
    } catch (e) {
      console.log(e);
    } finally {
    }
  }
  async function handleSaveAsTemplate() {
    try {
      setTemplateLoading(true);
      await createTemplateFlow(processId, templateForm);
      setTemplateForm(templateTemplate);
      fetchTemplateList();
      toast.success("Template " + templateForm.name + " created successfully");
      setTemplateDialog(false);
    } catch (e) {
      console.log(e);
    } finally {
      setTemplateLoading(false);
    }
  }

  function pushtoUndo(undo, stack) {
    setRedo([]);
    setUndo((state) => [...state, { stack: undo, action: stack }].slice(-10));
  }

  const onNotificationClick = (data: Node) => {
    if (!!openNotification) {
      setOpenNotification(null);
    }
    setOpenNotification(data);
    setSelectedNode(data);
    setSelectedNodeId(null);
    setFormOpen(false);
  };
  const nodeTypes = useMemo(
    () => ({
      WorkFlowNode: (props: any) => {
        return (
          <NodeWrapper>
            <WorkFlowNode
              onUserBtnClick={onUserBtnClick}
              onFormBtnClick={onFormBtnClick}
              onNotificationClick={onNotificationClick}
              selectedNodeId={selectedNodeId}
              setIsDrag={setIsDrag}
              groups={groups}
              workflowList={workflowList}
              masterNotificationList={masterNotificationList}
              setSelectedNode={setSelectedNode}
              {...props}
            />
          </NodeWrapper>
        );
      },
      ResizableNode: (props: any) => {
        return (
          <NodeWrapper>
            <ResizableNode {...props} />
          </NodeWrapper>
        );
      },
      BranchNode: (props) => {
        return (
          <NodeWrapper>
            <BranchNode {...props} />
          </NodeWrapper>
        );
      },
    }),
    [selectedNode, groups, workflowList, masterNotificationList]
  );

  const EdgeType: any = useMemo(
    () => ({
      AF: (props: any) => (
        <CustomEdge {...props} type="AF" setIsDrag={setIsDrag} />
      ),
    }),
    []
  );

  const getVersionList = async () => {
    try {
      const res = await getProcessVersionList(processId);
      setVersionList(res?.versions ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const onUserBtnClick = (id: any, data: any) => {
    setSelectedNodeId((prevSelectedId) => (prevSelectedId === id ? null : id));
    setSelectedNode(data);
    setFormOpen(false);
    setOpenNotification(null);
  };

  const onFormBtnClick = (node: any) => {
    setFormOpen(!formOpen);
    setSelectedNode(node);
    setSelectedNodeId(null);
    setOpenNotification(null);
  };

  async function listworkflowNode() {
    try {
      const data: any = await listWorkFlowNodes(processId);
      setLoader(false);
      setNodes(data?.nodes);
      setEdges(data?.edges);
    } catch (err) {
      setLoader(false);
    }
  }

  useEffect(() => {
    listworkflowNode();
    getVersionList();
  }, [processId]);

  // useEffect(() => {
  //   pollUnpublishedChanges();
  // }, [nodes, edges]);

  // const prevNodesRef = useRef(nodes);
  // const prevEdgesRef = useRef(edges);

  // useEffect(() => {
  //   if (
  //     JSON.stringify(prevNodesRef.current) === JSON.stringify(nodes) &&
  //     JSON.stringify(prevEdgesRef.current) === JSON.stringify(edges)
  //   ) {
  //     return; // No real change, exit early
  //   }

  //   prevNodesRef.current = nodes;
  //   prevEdgesRef.current = edges;

  //   const debouncedPoll = debounce(() => {
  //     pollUnpublishedChanges();
  //   }, 300);

  //   debouncedPoll();

  //   return () => {
  //     debouncedPoll.cancel();
  //   };
  // }, [nodes, edges]);

  useEffect(() => {
    fetchProcessById();
  }, [processId]);

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

      if (lastAddedNode?.id?.startsWith("flow")) {
        const payload = { ...lastAddedNode, process: processId };

        if (
          lastAddedNode.type === CustomNodeTypes.WORKFLOWNODE ||
          lastAddedNode.type === CustomNodeTypes.BRANCHNODE
        ) {
          const data = await createWorkFlowNode(payload);
          const node = [...nodes];
          node[node.length - 1] = data;
          pushtoUndo(
            { nodes: nodes.slice(0, -1), edges },
            { action: "add", type: "node", nodeId: data.id }
          );
          setNodes(node);
        } else {
          await createResizable(payload);
        }
      }
    })();
  }, [nodes.length]);

  const onConnect = useCallback(
    async (params: any) => {
      try {
        reactFlowInstance.getNode(params.target);

        // Check if an edge with the same source and target already exists
        const edgeExists = edges.some(
          (edge) =>
            edge.source === params.source && edge.target === params.target
        );

        if (!edgeExists) {
          const data = await createWorkFlowEdge({
            ...params,
            translations: {
              ar: { name: "إضافة اسم الإجراء" },
              en: { name: "Add Action Name" },
            },
          });

          setEdges((prevEdges) => [
            ...prevEdges,
            { ...data, data: { translations: data.translations } },
          ]);
          pushtoUndo(
            { nodes, edges },
            {
              type: "edge",
              action: "add",
              nodeId: data.id,
            }
          );
          return data;
        }
      } catch (err) {}
      // listworkflowNode();
    },
    [edges, nodes]
  );
  const handleSelectMenuItem = (item: CustomNodeTypes | undefined) => {
    setSelectedMenuItem(item);
  };

  function handleResize(e, data) {
    setFormContainerWidth(data.size.width);
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default right-click menu
    if (reactFlowWrapper.current) {
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
    }
  };

  const handleAddNode = (nodeType: CustomNodeTypes) => {
    const newNode: Node = {
      ...customNodeTypes[nodeType],
      id: getId(),
      position: reactFlowInstance.project({
        x: contextMenu.x,
        y: contextMenu.y,
      }),
    };
    setNodes((prev) => prev.concat(newNode));
    setContextMenu({ visible: false, x: 0, y: 0 }); // Hide context menu
  };

  // function onConnectEnd(event, item) {
  //   event.preventDefault(); // Prevent default right-click menu
  //   if (reactFlowWrapper.current) {
  //     const bounds = reactFlowWrapper.current.getBoundingClientRect();
  //     setTimeout(() => {
  //       setContextMenu({
  //         visible: true,
  //         x: event.clientX - bounds.left,
  //         y: event.clientY - bounds.top,
  //       });
  //     }, 0);
  // }
  // }

  const NodeIconMap = {
    [CustomNodeTypes.WORKFLOWNODE]: (
      <MdOutlineShare color="blue" style={{ fontSize: "10px" }} />
    ),
    [CustomNodeTypes.BRANCHNODE]: (
      <LuDiamond color="blue" style={{ fontSize: "10px" }} />
    ),
    [CustomNodeTypes.RESIZABLENODE]: (
      <MdOutlineSpaceDashboard color="blue" style={{ fontSize: "10px" }} />
    ),
    [CustomNodeTypes.NOTIFICATIONNODE]: (
      <MdOutlineNotificationAdd color="blue" style={{ fontSize: "10px" }} />
    ),
  };

  function handleTemplateFormChange(name: string, value: string) {
    setTemplateForm((state: object) => ({ ...state, [name]: value }));
  }

  const publishProcess = async () => {
    setPublishLoader(true);
    const payload = {
      uuid: processId,
      version_name: publishForm.version,
      comments: publishForm.comments,
    };
    try {
      await PostPublishProcess(payload);
      setisVisible(false);
      toast.success("Successfully deployed the process");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPublishLoader(false);
      setPublishDialog(false);
    }
  };

  useEffect(() => {
    const formbuilder = document.getElementById("form-builder");

    if (fullscreen) {
      const width =
        formbuilder?.querySelector(".form-builder-container ")?.clientWidth +
        70;

      setFullScreenWidth(width);
    }
  }, [fullscreen]);

  const publishFormChange = (name: string, value: string) => {
    setpublishForm((prev) => ({ ...prev, [name]: value }));
  };

  const getMappedId = (idd: string) => {
    const getMappedIdRecursive = (id: string): string => {
      if (idMap.has(id)) {
        return getMappedIdRecursive(idMap.get(id)!);
      } else {
        return id;
      }
    };

    return getMappedIdRecursive(idd);
  };

  function mapNodeAndEdgeId(id: string) {
    setNodes((prev) => {
      return prev.map((node) => ({ ...node, id: getMappedId(node.id) }));
    });

    setEdges((prev) =>
      prev.map((edge) => ({
        ...edge,
        id: getMappedId(edge.id),
        source: getMappedId(edge.source),
        target: getMappedId(edge.target),
      }))
    );
  }

  async function handleApibasedOnAction(
    action,
    actionType: "undo" | "redo",
    RedoNode?: Object
  ) {
    const nodeToAdd = RedoNode.find(
      (node) => getMappedId(node.id) === getMappedId(action.nodeId)
    );
    switch (action.action) {
      case "add": {
        if (actionType === "undo") {
          await deleteWorkFlowNode(getMappedId(action.nodeId));
          return;
        }
        const data = await createWorkFlowNode({
          ...nodeToAdd,
          process: processId,
        });
        idMap.set(nodeToAdd.id, data.id);
        mapNodeAndEdgeId();
        return;
      }
      case "delete":
        if (actionType === "undo") {
          const data = await createWorkFlowNode({
            ...nodeToAdd,
            process: processId,
          });

          idMap.set(nodeToAdd.id, data.id);
          mapNodeAndEdgeId();

          return;
        }
        return deleteWorkFlowNode(getMappedId(action.nodeId));
      case "modify":
        return updateWorkFlowNode({
          ...nodeToAdd,
          id: getMappedId(nodeToAdd.id),
        });
      default:
        break;
    }
  }

  async function handleApiBasedOnEdge(
    action,
    actionType: "undo" | "redo",
    RedoEdge?: Object
  ) {
    const edgeToAdd = RedoEdge.find(
      (node) => getMappedId(node.id) === getMappedId(action.nodeId)
    );

    switch (action.action) {
      case "add": {
        if (actionType === "undo") {
          await deleteWorkFlowEdge(getMappedId(action.nodeId));
          return;
        }
        const data = await createWorkFlowEdge({
          ...edgeToAdd,
          source: getMappedId(edgeToAdd.source),
          target: getMappedId(edgeToAdd.target),
          process: processId,
          translations:
            edgeToAdd?.data?.translations || edgeToAdd?.translations,
        });
        idMap.set(edgeToAdd.id, data.id);
        mapNodeAndEdgeId();

        return;
      }
      case "delete":
        if (actionType === "undo") {
          const data = await createWorkFlowEdge({
            ...edgeToAdd,
            source: getMappedId(edgeToAdd.source),
            target: getMappedId(edgeToAdd.target),
            id: getMappedId(edgeToAdd.id),
            process: processId,
          });

          idMap.set(edgeToAdd.id, data.id);
          mapNodeAndEdgeId();

          return;
        }
        return deleteWorkFlowEdge(getMappedId(action.nodeId));
      case "modify":
        return updateWorkFlowEdge({
          ...edgeToAdd,
          id: getMappedId(edgeToAdd.id),
        });
      default:
        break;
    }
  }

  const fetchProcessById = async () => {
    setTemplateLoader(true);
    try {
      const res = await fetchProcessDetails(processId);
      setProcessDetails(res);
      setTemplateLoader(false);
    } catch (error) {}
  };

  function getTranslatedText(data: any, key: string) {
    return data?.[locale]?.[key] || data?.[key];
  }

  const handleSwitchTemplate = async (uuid: string) => {
    setSwitchLoading(true);
    try {
      await applyTemplate(processId, uuid ?? selectedTemplate);
      setSelectedTemplate("");
      listworkflowNode();
      fetchProcessById(processId);
      toast.success("Template Applied successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmTemplate(false);
      setSwitchLoading(false);
    }
  };

  if (loader || templateLoader) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 150px)",
        }}
      >
        <CircularProgress sx={{ height: "10px", width: "10px" }} />{" "}
      </div>
    );
  }

  function setSelectedTemplateId(id: string) {
    setSelectedTemplate(id);
  }

  async function applyTemplateToPreview(id: string) {
    setSelectedTemplate(id);
    await applyTemplate(processId, id);
    listworkflowNode();
    toast.success("Preview Applied successfully");
  }

  async function generateForm(query) {
    setSelectedNode(selectedNodes[0]);
    setFormBuilderLoading(true);
    try {
      const data = await postMethod(`${GET_INTELLECTA_FORM}`, {
        prompt: query,
      });
      setAiGeneratedForm(data);
      setFormBuilderLoading(false);
      return data;
    } catch (error) {
      console.log("error", error);
    }
    setFormBuilderLoading(false);
  }

  if (
    processDetails.template === null &&
    nodes.length === 0 &&
    edges.length === 0
  ) {
    return (
      <Box sx={{ background: "#f9f9fb", minHeight: "calc(100vh - 65px)" }}>
        <WorkFlowTemplate
          width="100%"
          templates={templateList}
          setSelectedTemplate={setSelectedTemplateId}
          selectedTemplate={selectedTemplate}
          applyTemplate={setSelectedTemplate}
          handleSwitchTemplate={handleSwitchTemplate}
          processDetails={processDetails}
          handleSwicthTemplate={handleSwitchTemplate}
          loading={switchLoading}
        />
      </Box>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-300 h-[49px] p-2 pl-4 flex items-center justify-between">
        <div className="flex-1 min-w-0 ltr:text-left rtl:text-right">
          <div className="flex items-center gap-2">
            <Avatar src={processDetails.icon_url} sizes="20">
              {processDetails.icon_url ? processDetails?.name?.[0] : undefined}
            </Avatar>
            <div className="text-sm font-medium text-gray-900 ltr:pr-2 rtl:pl-2">
              {getTranslatedText(processDetails.translations, "name")}
              {getTranslatedText(processDetails.translations, "category")
                ? " - "
                : ""}
              <span className="text-blue-600 font-semibold ltr:ml-1 rtl:mr-1">
                {getTranslatedText(processDetails.translations, "category")}
              </span>
            </div>
            {processDetails.uuid && (
              <ProcessDetailsMenu processDetails={processDetails} />
            )}
          </div>
        </div>

        <Stack direction="row" alignItems={"center"}>
          <Tooltip title={translate("saveAsTemplate")}>
            <IconButton
              size="small"
              onClick={() => {
                setTemplateDialog(true);
              }}
            >
              <Save color="primary" />
            </IconButton>
          </Tooltip>
        </Stack>
        <div className="flex items-center gap-2 ml-2 mr-2">
          <div className="w-auto flex items-center justify-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              <FormattedMessage id="versionLabel"></FormattedMessage>
            </span>

            <div
              className={`shadow appearance-none border rounded-md w-full overflow-hidden flex items-center h-[30px]`}
            >
              <select
                onChange={() => {}}
                className="w-full p-2 text-base text-gray-700 bg-white focus:outline-none"
                value=""
              >
                <option value="">
                  <FormattedMessage id="selectVersion"></FormattedMessage>
                </option>
                {versionList.map((option, index) => (
                  <option key={index} value={option.uuid}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-[10px] flex items-center gap-3">
            <div className="flex-shrink-0">
              <FiAlertCircle
                className={`h-5 w-5 ${
                  isVisible ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>

            <div className="py-[3px] px-[10px] min-w-0 ltr:text-left rtl:text-right bg-gray-100 flex items-center justify-center rounded-md ltr:pr-2 rtl:pl-2 w-full">
              <div className="text-sm font-medium text-gray-900">
                {isVisible ? (
                  <FormattedMessage id="unPublishedChanges" />
                ) : (
                  <FormattedMessage id="lastVersionUpdated" />
                )}
              </div>
            </div>

            <button
              onClick={() => setPublishDialog(true)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-md font-medium rounded-md transition-colors ${
                false
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              <MdPublish />
              <FormattedMessage id="publish" />
            </button>
          </div>
        </div>
      </div>

      {formOpen && fullscreen && (
        <div id="form-builder">
          {selectedNode?.id && (
            <FormBuilderNew
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              fullScreen={fullscreen}
              handleToggleFullscreen={() => setFullScreen((state) => !state)}
              setFullScreen={setFullScreen}
              selectedNode={selectedNode}
              onClose={() => {
                setSelectedNode(null);
                setFormContainerWidth(800);
              }}
              formContainerWidth={fullScreenWidth}
              loader={formBuilderloading}
              setLoader={setFormBuilderLoading}
              generateForm={generateForm}
            />
          )}
        </div>
      )}
      <div
        className="relative flex"
        style={{
          height: "calc(100vh - 115px)",
        }}
      >
        <div
          className={`flex-grow w-[200px]`}
          ref={reactFlowWrapper}
          onContextMenu={handleContextMenu} // Add right-click listener
          dir="ltr"
        >
          <ReactFlow
            zoomOnScroll={true}
            nodes={nodes}
            minZoom={0.1}
            proOptions={{ hideAttribution: true }}
            edges={edges}
            onClick={(e) => {
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            onNodesChange={(changes) => {
              onNodesChange(changes);
            }}
            onEdgesChange={(changes) => {
              onEdgesChange(changes);
            }}
            fitView={true}
            nodeTypes={nodeTypes}
            onConnect={async (params) => {
              await onConnect(params);
            }}
            onNodesDelete={(param) => {
              pushtoUndo(
                { nodes, edges },
                {
                  type: "node",
                  action: "delete",
                  nodeId: param[0].id,
                }
              );
            }}
            onEdgesDelete={(param) => {
              pushtoUndo(
                { nodes, edges },
                {
                  type: "edge",
                  action: "delete",
                  nodeId: param[0].id,
                }
              );
            }}
            snapToGrid
            connectionLineType={ConnectionLineType.Bezier}
            connectionMode={ConnectionMode.Loose}
            edgeTypes={EdgeType}
            onNodeDragStart={(event, node) => {
              pushtoUndo(
                { nodes, edges },
                { type: "node", action: "modify", nodeId: node.id }
              );
            }}
            onNodeDragStop={async (event, node) => {
              await updateWorkFlowNode(node);
            }}
            nodesDraggable={isDrag}
            panOnDrag={isDrag}
            onEdgeClick={(event, edge) => {}}
            onNodeClick={(event, node) => {
              if (node.id !== selectedNode?.id) {
              } else {
              }
            }}
          >
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
          <FlowItemsMenu
            onSelectItem={handleSelectMenuItem}
            isUndoDisabled={!undo.length}
            isRedoDisabled={!redo.length}
            onUndo={(e) => {
              setIsDrag(true);
              if (undo.length) {
                const lastState = undo[undo.length - 1].stack;
                const action = undo[undo.length - 1].action;
                setNodes(lastState.nodes);
                setEdges(lastState.edges);
                setUndo((state) => state.slice(0, -1));
                setRedo((state) => [
                  ...state,
                  {
                    state: { nodes, edges },
                    action,
                  },
                ]);
                if (action.type === "node") {
                  handleApibasedOnAction(action, "undo", lastState.nodes);
                } else if (action.type === "edge") {
                  handleApiBasedOnEdge(action, "undo", lastState.edges);
                }
              }
            }}
            onRedo={(e) => {
              setIsDrag(true);
              if (redo.length) {
                const lastState = redo[redo.length - 1].state;
                const action = redo[redo.length - 1].action;
                setNodes(lastState.nodes);
                setEdges(lastState.edges);
                setRedo((state) => state.slice(0, -1));
                setUndo((state) => [
                  ...state,
                  { stack: { nodes, edges }, action },
                ]);
                if (action.type === "node") {
                  handleApibasedOnAction(action, "redo", lastState.nodes);
                } else if (action.type === "edge") {
                  handleApiBasedOnEdge(action, "redo", lastState.edges);
                }
              }
            }}
          />
          {!(selectedNodeId || selectedNode?.id) && (
            <AIChatBox
              placeholder="Generate form"
              onGenerate={generateForm}
              disableGenerate={!selectedNodes?.[0]?.id}
              generateHelperText={
                !selectedNodes?.[0]?.id && "Select a node to generate form"
              }
            />
          )}
        </div>
        {formOpen && !fullscreen && (
          <ResizableBox
            className="z-[1000]"
            width={840}
            height={0}
            axis="x"
            resizeHandles={["w"]}
            onResizeStop={handleResize}
            minConstraints={[840, 0]}
            maxConstraints={[1200, 0]}
            handle={
              <div
                style={{
                  width: "2px",
                  cursor: "ew-resize",
                  // backgroundColor: "#007bff",
                  height: "100vh",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            }
          >
            {selectedNode?.id && (
              <FormBuilderNew
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                selectedNode={selectedNode}
                onClose={() => {
                  setFormOpen(false);
                  setSelectedNode(null);
                  setFormContainerWidth(800);
                  setAiGeneratedForm(null);
                }}
                setAiGeneratedForm={setAiGeneratedForm}
                formContainerWidth={
                  fullscreen ? fullScreenWidth : formContainerWidth
                }
                aiGeneratedForm={aiGeneratedForm}
                fullScreen={fullscreen}
                handleToggleFullscreen={() => setFullScreen((state) => !state)}
                setFullScreen={setFullScreen}
              />
            )}
          </ResizableBox>
        )}
        {workflowDialogOpen && (
          <WorkFlowTemplate
            templates={templateList}
            onClose={() => setWorkflowDialogOpen(false)}
            setSelectedTemplate={setSelectedTemplateId}
            selectedTemplate={selectedTemplate}
            applyTemplate={applyTemplateToPreview}
          />
        )}
        {selectedNodeId && (
          <>
            <NodeUserList
              onClose={() => setSelectedNodeId("")} // This will close the sidebar
              selectedNodeId={selectedNodeId}
              show={!!selectedNodeId} // Control visibility based on selectedNodeId
              nodeName={
                selectedNode?.data?.translations?.[locale]?.name ??
                selectedNode?.data?.label ??
                ""
              }
              locale={locale}
            />
          </>
        )}

        {openNotification && (
          <NotificationDrawer
            nodeDetails={selectedNode}
            onClose={() => {
              setOpenNotification(null);
            }}
          />
        )}
        {contextMenu.visible && (
          <div
            className="absolute bg-white shadow-md rounded-md border border-[rgb(211, 211, 211)]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div
              style={{
                borderBottom: "1px solidrgb(211, 211, 211)",
                background: "#f9f9f9",
                borderTopLeftRadius: "6px",
                borderTopRightRadius: "6px",
              }}
            >
              <Typography
                variant="caption"
                className="p-1 pr-1.5 pl-2.5"
                fontSize={"10px"}
                fontWeight={"500"}
                color={"#808080"}
              >
                Add Block
              </Typography>
            </div>
            <div className="p-0.5">
              {Object.entries(CustomNodeTypesOptions)
                .slice(1)
                .map(([key, value]) => (
                  <div
                    key={value}
                    className="p-1 pl-2 hover:bg-gray-200 cursor-pointer rounded"
                    onClick={() => handleAddNode(CustomNodeTypes[key])}
                  >
                    <div className="flex justify-start items-center gap-2">
                      <div>{NodeIconMap?.[value]}</div>
                      <Typography variant="subtitle1" fontSize={"10px"}>
                        {customNodeTypes?.[value]?.data?.label}
                      </Typography>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <DialogCustomized
        open={publishDialog}
        handleClose={() => setPublishDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setPublishDialog(false)}>
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => {
                if (publishForm.version) {
                  publishProcess();
                } else {
                  setversionError(true);
                }
              }}
              disabled={publishLoader}
            >
              {translate("publish")}
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            <InputField
              label={translate("versionName")}
              value={publishForm.version}
              onChange={(e) => publishFormChange("version", e)}
              error={versionError && !publishForm.version}
              helperText={
                versionError &&
                !publishForm.version &&
                "Version name is required"
              }
            />

            <Stack>
              <Typography
                variant="subtitle1"
                textTransform={"capitalize"}
                mb={1}
              >
                <FormattedMessage id="comments"></FormattedMessage>
              </Typography>
              <div
                style={{
                  transition: "opacity 0.3s ease",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "0.25rem",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  position: "relative",
                  minHeight: "130px",
                }}
                className="shadow"
              >
                <textarea
                  style={{
                    height: "100%",
                    width: "100%",
                    outline: "none",
                  }}
                  rows={5}
                  value={publishForm?.comments}
                  onChange={(e) =>
                    publishFormChange("comments", e.target.value)
                  }
                ></textarea>
              </div>
            </Stack>
          </Stack>
        }
        title={translate("publishWorkflow")}
      />

      <DialogCustomized
        open={templateDialog}
        handleClose={() => setTemplateDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                setTemplateForm(templateTemplate);
                setTemplateDialog(false);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleSaveAsTemplate}
              disabled={templateLoading}
            >
              {translate("create")}
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            <InputField
              label={translate("templateName")}
              value={templateForm.name ?? ""}
              onChange={(e) => handleTemplateFormChange("name", e)}
            />
            <InputField
              label={translate("description")}
              value={templateForm?.description ?? ""}
              onChange={(e) => handleTemplateFormChange("description", e)}
            />
            <Stack direction="row" spacing={2}>
              <CheckBox
                label={translate("is_global")}
                isChecked={templateForm.is_global}
                onChange={(e) =>
                  handleTemplateFormChange("is_global", e.target.checked)
                }
              />
              <CheckBox
                label={translate("is_organization")}
                isChecked={templateForm.is_organization}
                onChange={(e) =>
                  handleTemplateFormChange("is_organization", e.target.checked)
                }
              />
            </Stack>
          </Stack>
        }
        title={"Create Template"}
      />

      <DialogCustomized
        open={confirmTemplate}
        handleClose={() => setConfirmTemplate(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                setConfirmTemplate(false);
                setSelectedTemplate("");
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleSwitchTemplate}
              disabled={switchLoading}
            >
              {translate("switchTemplate")}
            </Button>
          </Stack>
        }
        content={
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap={1.5}
            p={2}
            borderRadius={2}
          >
            <WarningAmber color="warning" />
            <Typography variant="body1" textAlign={"center"}>
              <FormattedMessage id="areYouSureTemplate"></FormattedMessage>
            </Typography>
          </Box>
        }
        title={<FormattedMessage id="areyouSure"></FormattedMessage>}
      />
    </div>
  );
}
