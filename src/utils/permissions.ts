export const ScreenNames: Record<string, string> = {
  home: "Home",
  inbox_inprogress: "Inbox - In Progress",
  inbox_completed: "Inbox - Completed",
  flow_builder: "Flow Builder",
  process_dashboard: "Process Dashboard",
  admin_organization: "Admin - Organization",
  admin_branch: "Admin - Branch",
  admin_department: "Admin - Department",
  admin_section: "Admin - Section",
  admin_staff: "Admin - Staff",
  admin_group: "Admin - Group",
  admin_process: "Admin - Process",
  admin_request: "Admin - Request",
  admin_process_version: "Admin - Process Version",
  admin_category: "Admin - Category",
  admin_trash: "Admin - Trash",
  admin_database: "Admin - Database",
};

export type ScreenKeyType =
  | "home"
  | "inbox_inprogress"
  | "inbox_completed"
  | "flow_builder"
  | "process_dashboard"
  | "admin_organization"
  | "admin_branch"
  | "admin_department"
  | "admin_section"
  | "admin_staff"
  | "admin_group"
  | "admin_process"
  | "admin_request"
  | "admin_process_version"
  | "admin_category"
  | "admin_trash"
  | "admin_database";

export type PermissionKeyType = "read" | "write" | "update" | "delete";

export enum ScreenKeyEnum {
  Home = "home",
  InboxInProgress = "inbox_inprogress",
  InboxCompleted = "inbox_completed",
  FlowBuilder = "flow_builder",
  ProcessDashboard = "process_dashboard",
  AdminOrganization = "admin_organization",
  AdminBranch = "admin_branch",
  AdminDepartment = "admin_department",
  AdminSection = "admin_section",
  AdminStaff = "admin_staff",
  AdminGroup = "admin_group",
  AdminProcess = "admin_process",
  AdminRequest = "admin_request",
  AdminProcessVersion = "admin_process_version",
  AdminCategory = "admin_category",
  AdminTrash = "admin_trash",
  AdminDatabase = "admin_database",
}

export const routeToScreenKeyMap: Record<string, ScreenKeyType> = {
  "/home": "home",
  "/inbox/inprogress": "inbox_inprogress",
  "/inbox/completed": "inbox_completed",
  "/process-list-v2": "flow_builder",
  "/administration/organization": "admin_organization",
  "/administration/organization-branch": "admin_branch",
  "/administration/user-list": "admin_staff",
  "/administration/processes": "admin_process",
  "/administration/requests": "admin_request",
  "/administration/categories": "admin_category",
  "/administration/user-groups": "admin_group",
  "/administration/trash": "admin_trash",
};

export const routePatterns: {
  pattern: string;
  screenKey: ScreenKeyType;
}[] = [
  { pattern: "/home", screenKey: "home" },
  { pattern: "/inbox/inprogress", screenKey: "inbox_inprogress" },
  { pattern: "/inbox/completed", screenKey: "inbox_completed" },
  { pattern: "/process-list-v2", screenKey: "flow_builder" },
  { pattern: "/process-list/create-process", screenKey: "flow_builder" },
  { pattern: "/process-list-v2/flow-builder/:processId", screenKey: "flow_builder" },

  { pattern: "/dashboard/process-dashboard", screenKey: "process_dashboard" },
  { pattern: "/administration/organization", screenKey: "admin_organization" },
  { pattern: "/administration/organization-branch", screenKey: "admin_branch" },
  {
    pattern: "/administration/departments/:branchId",
    screenKey: "admin_department",
  },
  {
    pattern: "/administration/organization-section/:departmentId",
    screenKey: "admin_section",
  },
  { pattern: "/administration/user-list", screenKey: "admin_staff" },
  { pattern: "/administration/user-groups", screenKey: "admin_group" },
  {
    pattern: "/administration/user-groups/users/:groupId",
    screenKey: "admin_group",
  },
  {
    pattern: "/administration/user-groups/permissions/:groupId",
    screenKey: "admin_group",
  },
  { pattern: "/administration/processes", screenKey: "admin_process" },
  { pattern: "/administration/requests", screenKey: "admin_request" },
  {
    pattern: "/administration/requests/:requestId",
    screenKey: "admin_request",
  },
  {
    pattern: "/administration/requests/tracks/:requestId",
    screenKey: "admin_request",
  },
  {
    pattern: "/administration/processes/versions/:processId",
    screenKey: "admin_process_version",
  },
  { pattern: "/administration/categories", screenKey: "admin_category" },
  { pattern: "/administration/trash", screenKey: "admin_trash" },
  {
    pattern: "/administration/database",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/parent-tables",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/parent-tables/database",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/parent-tables/database/:tableId",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/database/:tableId",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/database/dependent-tables/:tableId",
    screenKey: "admin_database",
  },
  {
    pattern: "/administration/database/column-values/:tableId",
    screenKey: "admin_database",
  },
];

export enum PermissionKeyEnum {
  Read = "read",
  Write = "write",
  Update = "update",
  Delete = "delete",
}

export function matchScreenKey(pathname: string): ScreenKeyType | undefined {
  for (const { pattern, screenKey } of routePatterns) {
    const regexPattern = pattern.replace(/:(\w+)/g, "([^/]+)");
    const regex = new RegExp(`^${regexPattern}$`);

    if (regex.test(pathname)) {
      return screenKey;
    }
  }

  return undefined;
}
