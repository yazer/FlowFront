const token = localStorage.getItem("token");
// export const BASE_URL = "https://godfather123.pythonanywhere.com";
export const BASE_URL = "https://sandbox.processflowai.com";
// export const BASE_URL = window.location.origin.includes("localhost")
//   ? "https://godfather123.pythonanywhere.com"
//   : window.location.origin;
// export const BASE_URL = window.location.origin;
// export const BASE_URL = "https://processflowai.com";
// export const BASE_URL = "http://127.0.0.1:8000/";
export const AUTH_TOKEN = `Token ${token}`;

export const GET_ORGANIZATION = `${BASE_URL}/api/organization/`;
export const ORGANIZATION_HEIRARCHY = `${BASE_URL}/organization/hierarchy/`;
export const ORGANIZATION_HEIRARCHY_EDGE = `${BASE_URL}/organization/edge/`;
export const WORK_FLOW_NODE = `${BASE_URL}/api/workflow/node/`;
export const WORK_FLOW_EDGE = `${BASE_URL}/api/workflow/edge/`;
export const RESIZABLE_NODE = `${BASE_URL}/api/workflow/background/`;

export const CREATE_TEMPLATE = `${BASE_URL}/api/workflow/v2/create-template/`;
export const TEMPLATE_LIST = `${BASE_URL}/api/workflow/v2/template-list/`;
export const TEMPLATE_PROCESS_DETAIL = `${BASE_URL}/api/workflow/v2/template-process-detail/`;
export const APPLY_TEMPLATE = `${BASE_URL}/api/workflow/v2/process/`;

export const GET_NOTIFICATION_LIST = `${BASE_URL}/api/workflow/v2/notification-types`;
export const GET_NOTIFICATION_USERS = `${BASE_URL}/api/workflow/v2/notification-users/`;
export const GET_NOTIFICATION_METHODS = `${BASE_URL}/api/workflow/v2/notification-methods/`;

export const GET_BRANCH_NODE_DETAILS = `${BASE_URL}/api/workflow/v2/field-list`;
export const GET_CONDITION_MASTER_LIST = `${BASE_URL}/api/workflow/v2/get-conditions`;
export const POST_CONDITION_MASTER = `${BASE_URL}/api/workflow/v2/condition-master/`;
export const GET_BRANCH_NODE_CONDITION_LIST = `${BASE_URL}/api/workflow/v2/condition-list`;
export const GET_BRANCH_NODE_ELEMENTS_BY_CONDITION = `${BASE_URL}/api/workflow/v2/condition-field-list`;

export const WORK_FLOW_PROCESS = `${BASE_URL}/api/workflow/process/`;
export const PROCESS_DETAILS = `${BASE_URL}/api/workflow/v2/process/`;

export const WORK_FLOW_CATEGORIES = `${BASE_URL}/api/workflow/category/`;
export const WORK_FLOW_REQUEST = `${BASE_URL}/api/workflow/request/`;
export const WORK_FLOW_FORM = `${BASE_URL}/api/workflow/form/`;
export const WORK_CREATE_TRACK = `${BASE_URL}/api/fe/create-track/`;
export const LOGIN = `${BASE_URL}/api/login/`;
export const ORGANIZATION_STAFF = `${BASE_URL}/api/organization/staff`;
export const GETINBOX = `${BASE_URL}/api/fe/inbox`;
// export const GETINBOXDETAILS = `${BASE_URL}/workflow/inbox-detail/`;
export const GETINBOXDETAILS = `${BASE_URL}/api/fe/inbox/`;
export const GETINBOXTRACKHISTORY = `${BASE_URL}/api/fe/get-track-history/`;

export const PROCESS_TRACK = `${BASE_URL}/api/workflow/track/`;
export const PROCESS_NEXT_TRACK = `${BASE_URL}/api/fe/create-next-track/`;

export const MODULES = `${BASE_URL}/api/workflow/modules/`;

export const GRAPH_BUILDER_SHEET = `${BASE_URL}/api/graph-builder/sheet/`;
export const GRAPH_BUILDER_CHART_DETAILS = `${BASE_URL}/api/graph-builder/chart-details/`;
export const GRAPH_BUILDER_DATA_SET = `${BASE_URL}/api/graph-builder/data-set/`;
export const GRAPH_BUILDER_LIST_BY_DATASET = `${BASE_URL}/api/graph-builder/data-set/`;

export const GET_PROCESS_LANGUAGE = `${BASE_URL}/api/administration/language/`;
export const GET_ADMINISTRATION_PROCESS_VERSION = `${BASE_URL}/api/administration/process-version/`;
export const CREATE_PROCESS = `${BASE_URL}/api/workflow/process/`;

export const GET_FILTER_LIST = `${BASE_URL}/api/fe/get-filter/`;
export const ADD_FILTER = `${BASE_URL}/api/fe/add-filter/`;
export const GET_USER_FILTER = `${BASE_URL}/api/fe/get-user-filter/`;
export const DELETE_FILTER = `${BASE_URL}/api/fe/delete-filter/`;
export const UPDATE_FILTER = `${BASE_URL}/api/fe/update-filter/`;
export const GET_ADMINISTRATION_PROCESS = `${BASE_URL}/api/administration/process`;
export const GET_ADMINISTRATION_PROCESS_DETAILS = `${BASE_URL}/api/administration/process`;

export const GET_ADMINISTRATION_REQUEST = `${BASE_URL}/api/administration/request`;
export const GET_ADMINISTRATION_REQUEST_DETAILS = `${BASE_URL}/api/workflow/v2/request-status`;

export const VALIDATE_PROCESS = `${BASE_URL}/api/workflow/v2/validate-process`;
export const PUBLISH_PROCESS = `${BASE_URL}/api/fe/publish-process/`;
export const GET_PUBLISH_CHANGES_PROCESS = `${BASE_URL}/workflow/v2/unpublish-status/`;

export const DEPARTMENT_URL = `${BASE_URL}/api/organization/departments/`;
export const BRANCH_URL = `${BASE_URL}/api/organization/branch`;
export const PROCESS_LIST_URL = `${BASE_URL}/api/workflow/v2/process-list/`;
export const GET_DEPARTMENT_URL = `${BASE_URL}/api/fe/departments`;
export const UPDATE_DEPARTMENT_STATUS = `${BASE_URL}/api/department/`;

export const DEPAARTMENT_ORG = `${BASE_URL}/api/organization/department/`;
export const TEMPLATE_ID = `${BASE_URL}/api/workflow/v2/template-id/`;

export const CATEGORY_URL = `${BASE_URL}/api/administration/category/`;
export const GET_CATEGORY_URL_BY_DEPARTMENT = `${BASE_URL}/api/fe/category/`;
export const GROUP_URL = `${BASE_URL}/api/fe/group/`;
export const CREATE_CATEGORY = `${BASE_URL}/api/administration/category/`;
export const CREATE_DEPARTMENT = `${BASE_URL}/api/workflow/department/`;
export const CREATE_BRANCH = `${BASE_URL}/api/organization/branch/`;
export const CREATE_SECTION = `${BASE_URL}/api/organization/sections/`;

export const FAVORITE_URL = `${BASE_URL}/api/fe/favorite-process/`;
export const TEMPLATE = `${BASE_URL}/api/fe/templates`;
export const TEMPLATE_DETAILS = `${BASE_URL}/api/fe/templates-detail`;

export const GET_TIME_ZONE = `${BASE_URL}/api/fe/timezone`;
export const UPDATE_TIME_ZONE = `${BASE_URL}/api/fe/update-timezone/`;

export const GET_FORM_FIELDS = `${BASE_URL}/api/workflow/form-fields`;
export const GET_PROCESS_DETAILS = `${BASE_URL}/api/workflow/process-detail`;

export const GET_WORKFLOW_FORMFIELDS = `${BASE_URL}/api/workflow/form-fields/`;
export const NODE_EDGE_LIST = `${BASE_URL}/api/workflow/v2/node-edge-list/`;

export const GET_ATTACHMENT_BY_REQUEST = `${BASE_URL}/api/fe/get-attachments`;
export const GET_INBOX_DETAILS_INPROGRESS = `${BASE_URL}/api/fe/get-new-request-details/`;
export const GET_INBOX_DETAILS_COMPLETED = `${BASE_URL}/api/fe/get-request-details/`;
export const INBOX_IS_READ = `${BASE_URL}/api/fe/is-read/`;
export const GET_INBOX_WORKFLOW = `${BASE_URL}/api/fe/get-request-timeline/`;
export const GET_STAFF_ORGANIZATION = `${BASE_URL}/api/organization/staff`;
export const CREATE_STAFF = `${BASE_URL}/api/create-staff/`;
export const UPDATE_STAFF = `${BASE_URL}/api/update-staff/`;

export const GET_PROCESS_VERSIONS = `${BASE_URL}/api/fe/process-versions/`;

export const LIST_NODE_USERS = `${BASE_URL}/api/fe/node-user`;

export const GET_TABLE_LIST = `${BASE_URL}/api/fe/dropdown-metadata/`;

export const GET_TABLE_LIST_BY_ID = `${BASE_URL}/api/fe/dropdown-metadata/`;

export const UPDATE_ORGANIZATION_BASIC_DETAILS = `${BASE_URL}/api/fe/organization/`;

export const GET_COLUMN_LIST_BY_TABLEID = `${BASE_URL}/api/fe/tables/`;

export const GET_FORM_REQUIRED_DOCUMENTS = `${BASE_URL}/api/fe/form-requirements/`;
export const GET_ORGANIZATION_DETAILS = `${BASE_URL}/api/organization/`;

export const GET_SECTION_DETAILS = `${BASE_URL}/api/organization/sections/`;

export const GET_NODE_USER_GROUP_FILTER_LIST = `${BASE_URL}/api/fe/group/`;
export const GET_NODE_USER_DEPARTMENT__FILTER_LIST = `${BASE_URL}/api/fe/departments/`;
export const GET_NODE_USER_BY_GROUP = `${BASE_URL}/api/group/user/`;

export const GET_GROUPS = `${BASE_URL}/api/fe/group/`;
export const GET_GROUPS_USERS = `${BASE_URL}/api/fe/group/user/`;
export const GET_WORKFLOW_NODES = `${BASE_URL}/api/fe/nodes/`;

export const GET_DB_TABLES = `${BASE_URL}/api/fe/data-tables/`;

export const GET_NOTIFICATION_LIST_HEIRARCHY = `${BASE_URL}/api/fe/notification-list/`;

export const TRASH = `${BASE_URL}/api/administration/trash/`;

export const UPDATE_FILTER_STATUS = `${BASE_URL}/api/fe/update-filter-status/ `;
export const GET_USER_PROFILE = `${BASE_URL}/api/fe/get-user-profile/`;
export const PROCESS_DEACTIVATE = `${BASE_URL}/api/fe/process-deactivate/`;
export const ADD_FILES_PROCESS = `${BASE_URL}/api/workflow/add-process-doc/`;
export const GET_FILES_PROCESS = `${BASE_URL}/api/fe/get-process-docs/`;

export const POST_PAGE_PREFERENCE = `${BASE_URL}/api/fe/set-page-preferences/`;
export const DELETE_STAFF = `${BASE_URL}/api/usermanagement/delete-staff/`;
export const GET_INTELLECTA_FORM = `${BASE_URL}/api/intellecta/form/`;

export const GET_PROCESS_DOCS = `${BASE_URL}/api/workflow/get-process-doc/`;
export const DELETE_PROCESS_DOCS = `${BASE_URL}/api/workflow/delete-process-doc/`;

export const REQUEST_PAUSE = `${BASE_URL}/api/administration/request/`;

export const EXPORT_PROCESS_ADMIN = `${BASE_URL}/api/administration/process`;
export const EXPORT_BRANCH = `${BASE_URL}/api/organization/branch`;
export const EXPORT_DEPARTMENT = `${BASE_URL}/api/organization/departments`;
export const EXPORT_SECTION = `${BASE_URL}/api/organization/sections`;
export const EXPORT_REQUEST = `${BASE_URL}/api/administration/request`;
export const EXPORT_FLOW_BUILDER = `${BASE_URL}/api/workflow/process`;
export const EXPORT_USER = `${BASE_URL}/api/organization/staff`;
export const EXPORT_CATEGORY = `${BASE_URL}/api/administration/category`;

export const REQUEST_TRACK = `${BASE_URL}/api/administration/request-status/`;

export const UPLOAD_CHUNK = `${BASE_URL}/api/administration/upload-chunk/`;
export const APPEND_CHUNK = `${BASE_URL}/api/administration/append-chunk/`;
export const DELETE_ROW_CSV = `${BASE_URL}/api/administration/delete-row/`;

export const GET_NODE_LIST = `${BASE_URL}/api/workflow/v2/get-node-list/`;
export const GET_NODE_FIELD_LIST = `${BASE_URL}/api/workflow/v2/node-field-list/`;

export const GET_UNASSIGNED_STAFF = `${BASE_URL}/api/administration/group/`;

export const DATA_GRID_ADD_COLUMN = `${BASE_URL}/api/fe/add-column/`;

export const UPDATE_DATAGRID_COLUMN = `${BASE_URL}/api/fe/update-column/`;

export const ADD_STAFF_TO_GROUP = `${BASE_URL}/api/administration/group/staff/`;
export const REMOVE_STAFF_FROM_GROUP = `${BASE_URL}/api/administration/group/staff/`;

export const GET_PERMISSIONS = `${BASE_URL}/api/administration/user-permissions/`;

export const ADD_PERMISSIONS = `${BASE_URL}/api/administration/add-page-permissions/`;
export const REMOVE_PERMISSIONS = `${BASE_URL}/api/administration/remove-page-permissions/`;

export const CREATE_GROUP = `${BASE_URL}/api/administration/group/`
export const GET_FILTER_DATA = `${BASE_URL}/api/fe/get-filter-data/`

export const GET_COLUMNS_META_DATA = `${BASE_URL}/api/fe/columns/`
export const GET_GROUP_PERMISSIONS = `${BASE_URL}/api/administration/group-permissions/`