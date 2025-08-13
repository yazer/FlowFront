import { Node } from "reactflow";
import { backgroundColors } from "./constants";

export enum CustomNodeTypes {
  DEFAULT = "NormalNode",
  WORKFLOWNODE = "WorkFlowNode",
  RESIZABLENODE = "ResizableNode",
  BRANCHNODE = "BranchNode",
  // NOTIFICATIONNODE = "NotificationNode",
}

export enum CustomNodeTypesOptions {
  DEFAULT = "NormalNode",
  WORKFLOWNODE = "WorkFlowNode",
  // NOTIFICATIONNODE = "NotificationNode",
}

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export const customNodeTypes: {
  [key: string]: WithRequiredProperty<Partial<Node>, "data">;
} = {
  [CustomNodeTypes.DEFAULT]: {
    type: CustomNodeTypes.DEFAULT,
    data: {
      label: "New Node",
      translations: {
        en: { name: "Add workflow name", description: "", language: "en" },
        ar: { name: "إضافة اسم سير العمل", description: "", language: "ar" },
      },
    },
  },
  [CustomNodeTypes.WORKFLOWNODE]: {
    type: CustomNodeTypes.WORKFLOWNODE,
    data: {
      label: "New Node",
      translations: {
        en: { name: "Add workflow name", description: "", language: "en" },
        ar: { name: "إضافة اسم سير العمل", description: "", language: "ar" },
      },
      notifications: [
        {
          notification_id: `${Date.now()}`,
          edge_uuid: "",
          staff_list: [],
          method_uuid: [],
          description: "",
        },
      ],
    },
  },
  // [CustomNodeTypes.RESIZABLENODE]: {
  //   type: CustomNodeTypes.RESIZABLENODE,

  //   data: {
  //     label: "Resizable Node",
  //     translations: {
  //       en: { name: "Add workflow name", description: "", language: "en" },
  //       ar: { name: "إضافة اسم سير العمل", description: "", language: "ar" },
  //     },
  //   },
  //   style: { backgroundColor: backgroundColors.sky, width: 1200, height: 600 },
  // },
  // [CustomNodeTypes.BRANCHNODE]: {
  //   type: CustomNodeTypes.BRANCHNODE,
  //   data: {
  //     label: "Add Conditions",
  //     conditions: [
  //       { condition_id: `${Date.now()}`, type: "if", elements: [] },
  //       { condition_id: `${Date.now() + 1}`, type: "else", elements: [] },
  //     ],
  //   },
  // },
  // [CustomNodeTypes.NOTIFICATIONNODE]: {
  //   type: CustomNodeTypes.NOTIFICATIONNODE,
  //   data: { label: "Add Notification" },
  // },
};
