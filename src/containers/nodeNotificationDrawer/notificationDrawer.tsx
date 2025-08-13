import {
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Stack,
} from "@mui/material";
import "./notificationDrawer.css";
import { Close } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { Node, useReactFlow } from "reactflow";
import { AiOutlineDelete } from "react-icons/ai";
import DropDownNode from "../../pages/workflow V2/DropDownNode";
import MultiSelectDropdownNode from "../../pages/workflow V2/MultiSelectDropDownNode";
import TreeViewUsers from "../../components/WorkFlowNode/treeViewSelectUsers";
import { isEqual } from "lodash";
import {
  getNotificationActionList,
  getNotificationHeirarchyList,
  getNotificationMethods,
  updateWorkFlowNode,
} from "../../apis/flowBuilder";
import { useEffect, useState } from "react";
import EmailTemplateEditor from "../../components/TemplateTextArea/TemplateTextArea";
import { getMethod, putMethod } from "../../apis/ApiMethod";
import { GET_NODE_LIST, WORK_FLOW_NODE } from "../../apis/urls";
import toast from "react-hot-toast";
import { returnErrorToast } from "../../utils/returnApiError";
import { ResizableBox } from "react-resizable";

type Props = {
  nodeDetails: Node | null;
  onClose: () => void;
};

export type NotificationPayload = {
  notification_id: string;
  edge_uuid: string;
  method_uuid: string[];
  description: Record<string, string>;
  staff_list: string[];
  group_uuid: string[];
  workflow_users: string[];
  email_body: string;
  email_body_details: Record<string, Record<string, string>>;
};

const NotificationDrawer = ({ nodeDetails, onClose }: Props) => {
  const { locale } = useIntl();
  const reactFlowInstance = useReactFlow();
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationList, setNotificationList] = useState([]);
  const [notificationMethods, setNotificationMethods] = useState([]);
  const [masterNotificationList, setMasterNotificationList] = useState<any>([]);

  useEffect(() => {
    if (nodeDetails?.data?.notifications) {
      setNotifications(nodeDetails?.data?.notifications);
    }
  }, [nodeDetails]);

  console.log(nodeDetails);
  console.log(notifications);
  const getMethods = async () => {
    const data = await getNotificationMethods();
    setNotificationMethods(data);
  };

  const getNotificationOptions = async () => {
    setLoading(true);
    const data = await getNotificationActionList(nodeDetails?.id ?? "");
    setLoading(false);
    setNotificationList(data);
  };

  useEffect(() => {
    if (nodeDetails?.id) {
      getNotificationOptions();
    }
    if (notificationMethods.length === 0) {
      getMethods();
    }
    fetchNotificationHeirarchyList();
  }, [nodeDetails?.id]);

  const fetchNotificationHeirarchyList = async () => {
    try {
      const res = await getNotificationHeirarchyList("");
      let data = [
        {
          id: "workflow_users",
          label: {
            en: { name: "Workflow users" },
            ar: { name: "مستخدمو سير العمل" },
          },
          children: res?.workflow?.map((item: any) => ({
            label: item?.translations,
            id: item?.uuid,
          })),
        },
        {
          id: "group_uuid",
          label: { en: { name: "Groups" }, ar: { name: "المجموعات" } },
          children: res?.groups?.map((item: any) => ({
            label: item?.translations,
            id: item?.id,
          })),
        },
        {
          id: "staff_list",
          label: { en: { name: "Users" }, ar: { name: "المستخدمون" } },
          children: res?.staff_list?.map((item: any) => ({
            label: item?.translations,
            id: item?.uuid,
          })),
        },
      ];
      setMasterNotificationList(data);
    } catch (error) {
      console.log(error);
    }
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
      description: { en: "", ar: "" },
      group_uuid: [],
      workflow_users: [],
      email_body: "",
      email_body_details: {},
    };

    updateNodeNotifications([...temp, newNotification]);
  };

  const handleChange = (id: string, name: string, value: any) => {
    let isDescription = name === "description";
    let updatedValue = notifications.map((item) =>
      item.notification_id === id
        ? {
            ...item,
            [name]: isDescription ? { [locale]: value } : value,
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

  const [submitLoader, setSubmitLoader] = useState(false);
  const updateNodeNotifications = async (
    notifications: NotificationPayload[],
    isUpdateAPI: boolean = false
  ) => {
    const updatedNode = {
      ...nodeDetails,
      id: nodeDetails?.id,
      data: {
        ...nodeDetails?.data,
        notifications: notifications,
      },
    };
    if (isUpdateAPI) {
      try {
        setSubmitLoader(true);
        const res = await putMethod(
          WORK_FLOW_NODE + nodeDetails?.id + "/",
          updatedNode
        );
        toast.success(
          <FormattedMessage id="successMsgNotificationCreate"></FormattedMessage>
        );
      } catch (error) {
        returnErrorToast({ error: error, locale: locale });
      } finally {
        setSubmitLoader(false);
        onClose();
      }
    }

    reactFlowInstance.setNodes(
      reactFlowInstance
        .getNodes()
        .map((node: any) =>
          node.id === nodeDetails?.id
            ? { ...node, data: { ...node.data, notifications: notifications } }
            : node
        )
    );
    setNotifications(notifications);
    // reactFlowInstance.setNodes(updatedNodeValue);
  };

  const handleSubmit = () => {
    updateNodeNotifications(notifications, true);
  };

  const resetNotifications = () => {
    reactFlowInstance.setNodes(
      reactFlowInstance.getNodes().map((node: any) =>
        node.id === nodeDetails?.id
          ? {
              ...node,
              data: {
                ...node.data,
                notifications: nodeDetails?.data?.notifications,
              },
            }
          : node
      )
    );
  };

  return (
    <ResizableBox
      className="z-[1000]"
      width={500}
      height={0}
      axis="x"
      resizeHandles={["w"]}
      // onResizeStop={handleResize}
      minConstraints={[500, 0]}
      maxConstraints={[1200, 0]}
      handle={
        <div
          style={{
            width: "2px",
            cursor: "ew-resize",
            // backgroundColor: "#007bff",
            height: "calc(100vh - 113px)",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      }
    >
      <div
        className={`flex flex-col bg-white p-4 border border-gray-300 h-[calc(100vh_-_113px)] overflow-y-auto`}
        style={{ minHeight: 0, flex: 1 }}
      >
        {/* Fixed Header */}
        <div
          className="header flex flex-row justify-between items-center"
          style={{ flexShrink: 0 }}
        >
          <span style={{ fontSize: "16px" }}>
            <FormattedMessage id="notification" /> -{" "}
            <span className="text-blue-600 font-semibold ltr:ml-1 rtl:mr-1">
              {nodeDetails?.data?.translations?.[locale]?.name}
            </span>
          </span>

          <IconButton
            size="small"
            onClick={() => {
              onClose();
              resetNotifications();
            }}
          >
            <Close />
          </IconButton>
        </div>

        {/* Scrollable Body */}
        <div
          className="notification-body overflow-y-auto"
          style={{ flexGrow: 1, minHeight: 0 }}
        >
          {loading ? (
            <>
              <SkeletonLoader />
            </>
          ) : (
            <>
              {notifications &&
                Array.isArray(notifications) &&
                notifications?.map((item) => (
                  <div
                    style={{
                      transition: "opacity 0.3s ease",
                      marginTop: "10px",
                      marginBottom: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      overflowY: "auto",
                      minHeight: "300px",
                      maxHeight: "500px",
                    }}
                    onScroll={(e: any) => {
                      e.stopPropagation();
                    }}
                  >
                    <div
                      className="flex flex-row items-center justify-between"
                      style={{
                        marginBottom: "8px",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          color: "grey",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        <FormattedMessage id={"addNotification"} />
                      </label>

                      {notifications.length > 1 && (
                        <button
                          className="ml-1 p-1 hover:bg-slate-300 rounded-md"
                          onClick={() =>
                            handleDeleteNotification(item.notification_id)
                          }
                          title={"Delete"}
                        >
                          <AiOutlineDelete />
                        </button>
                      )}
                    </div>

                    <Stack spacing={1.2}>
                      <DropDownNode
                        options={
                          notificationList && Array.isArray(notificationList)
                            ? notificationList?.map((item: any) => ({
                                value: item?.uuid ?? "",
                                label:
                                  (item?.translations?.[locale]?.name ?? "") ||
                                  (item?.name ?? ""),
                              }))
                            : []
                        }
                        value={item.edge_uuid}
                        id={nodeDetails?.id ?? ""}
                        placeholder={
                          <FormattedMessage id="selectNotificationAction" />
                        }
                        onChange={(value) =>
                          handleChange(item.notification_id, "edge_uuid", value)
                        }
                      />

                      {/* 
                            <MultiSelectDropdownNode
                              id={id}
                              options={
                                notificationUsers && Array.isArray(notificationUsers)
                                  ? notificationUsers?.map((item: any) => ({
                                      value: item?.uuid ?? "",
                                      label: item?.name ?? "",
                                      imgUrl: item?.profile_img,
                                    }))
                                  : []
                              }
                              placeholder={
                                <FormattedMessage id="selectNotificationUsers" />
                              }
                              value={item.staff_list}
                              onChange={(value) =>
                                handleChangeMultiSelect(
                                  item.notification_id,
                                  "staff_list",
                                  value
                                )
                              }
                              search={true}
                            /> */}
                      <MultiSelectDropdownNode
                        id={nodeDetails?.id ?? ""}
                        options={
                          notificationMethods &&
                          Array.isArray(notificationMethods)
                            ? notificationMethods?.map((item: any) => ({
                                value: item?.uuid ?? "",
                                label: item?.translations?.[locale]?.name ?? "",
                              }))
                            : []
                        }
                        placeholder={
                          <FormattedMessage id="selectNotificationMethod" />
                        }
                        value={item.method_uuid}
                        onChange={(value) =>
                          handleChangeMultiSelect(
                            item.notification_id,
                            "method_uuid",
                            value
                          )
                        }
                      />

                      <div>
                        <label
                          style={{
                            display: "block",
                            color: "grey",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          <FormattedMessage
                            id={"selectNotificationUsers"}
                          ></FormattedMessage>{" "}
                        </label>
                        <TreeViewUsers
                          onChange={(e) => {
                            handleChangeTreeView(item.notification_id, e);
                          }}
                          data={masterNotificationList}
                          checked={{
                            group_uuid: item?.group_uuid ?? [],
                            staff_list: item?.staff_list ?? [],
                            workflow_users: item?.workflow_users ?? [],
                          }}

                          // id={"process_id"}
                          // label="process_name"
                          // childKey="children"
                        />
                      </div>

                      {/* <MultiSelectDropdownNode
                              id={id}
                              options={
                                groups && Array.isArray(groups)
                                  ? groups?.map((item: any) => ({
                                      value: item?.id ?? "",
                                      label: item?.name ?? "",
                                    }))
                                  : []
                              }
                              placeholder={
                                <FormattedMessage id="selectNotificationUserGroups" />
                              }
                              value={item?.group_uuid ?? []}
                              onChange={(value) =>
                                handleChangeMultiSelect(
                                  item.notification_id,
                                  "group_uuid",
                                  value
                                )
                              }
                            /> */}
                      {/* 
                            <MultiSelectDropdownNode
                              id={id}
                              options={
                                workflowList && Array.isArray(workflowList)
                                  ? workflowList?.map((item: any) => ({
                                      value: item?.uuid ?? "",
                                      label: item?.translations?.[locale]?.name ?? "",
                                    }))
                                  : []
                              }
                              placeholder={
                                <FormattedMessage id="selectNotificationWorkflowGroups" />
                              }
                              value={item?.workflow_users_uuid ?? []}
                              onChange={(value) =>
                                handleChangeMultiSelect(
                                  item.notification_id,
                                  "workflow_users_uuid",
                                  value
                                )
                              }
                            /> */}

                      {item?.edge_uuid?.length > 0 &&
                        item?.method_uuid?.length > 0 &&
                        (item?.staff_list?.length > 0 ||
                          item?.group_uuid?.length > 0 ||
                          item?.workflow_users?.length > 0) && (
                          <EmailTemplateEditor
                            notifications={notifications}
                            updateNodeNotifications={updateNodeNotifications}
                            currentItem={item}
                          />
                        )}
                    </Stack>
                  </div>
                ))}
              <Button
                disabled={loading}
                variant="contained"
                onClick={handleAddNotification}
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <FormattedMessage id={"addNotificationButton"} />
              </Button>
            </>
          )}
        </div>

        {/* Fixed Footer */}
        <div
          className="footer flex flex-row items-center gap-2 bg-[#f9f9fb] pt-4"
          style={{ flexShrink: 0 }}
        >
          <Button
            variant="text"
            onClick={() => {
              onClose();
              resetNotifications();
            }}
            disabled={loading}
          >
            <FormattedMessage id="cancel"></FormattedMessage>
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || submitLoader}
          >
            <FormattedMessage id="submitButton"></FormattedMessage>
          </Button>
        </div>
      </div>
    </ResizableBox>
  );
};

export default NotificationDrawer;

const SkeletonLoader = () => {
  return (
    <>
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflowY: "auto",
            minHeight: "300px",
            maxHeight: "500px",
          }}
        >
          <div className="flex flex-row items-center justify-between mb-2">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>

          <Stack spacing={1.5}>
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />

            <div>
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="rectangular" height={100} />
            </div>

            <Skeleton variant="rectangular" height={100} />
          </Stack>
        </div>
      ))}

      <Skeleton
        variant="rectangular"
        height={40}
        style={{
          marginTop: "10px",
          borderRadius: "6px",
          width: "100%",
        }}
      />
    </>
  );
};
