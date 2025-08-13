import { Edge, Node } from "reactflow";
import { CustomNodeTypes } from "../utils/customFlowItems";
import {
  ADD_FILTER,
  APPLY_TEMPLATE,
  BASE_URL,
  CREATE_CATEGORY,
  CREATE_PROCESS,
  CREATE_TEMPLATE,
  DELETE_FILTER,
  GET_BRANCH_NODE_CONDITION_LIST,
  GET_BRANCH_NODE_DETAILS,
  GET_BRANCH_NODE_ELEMENTS_BY_CONDITION,
  GET_CONDITION_MASTER_LIST,
  GET_FILTER_LIST,
  GET_FORM_REQUIRED_DOCUMENTS,
  GET_GROUPS,
  GET_NODE_USER_BY_GROUP,
  GET_NODE_USER_DEPARTMENT__FILTER_LIST,
  GET_NODE_USER_GROUP_FILTER_LIST,
  GET_NOTIFICATION_LIST,
  GET_NOTIFICATION_LIST_HEIRARCHY,
  GET_NOTIFICATION_METHODS,
  GET_NOTIFICATION_USERS,
  GET_PROCESS_DETAILS,
  GET_PROCESS_VERSIONS,
  GET_PUBLISH_CHANGES_PROCESS,
  GET_TABLE_LIST,
  GET_USER_FILTER,
  GET_WORKFLOW_FORMFIELDS,
  GET_WORKFLOW_NODES,
  LIST_NODE_USERS,
  NODE_EDGE_LIST,
  POST_CONDITION_MASTER,
  PUBLISH_PROCESS,
  RESIZABLE_NODE,
  TEMPLATE,
  TEMPLATE_DETAILS,
  TEMPLATE_LIST,
  TEMPLATE_PROCESS_DETAIL,
  UPDATE_FILTER,
  VALIDATE_PROCESS,
  WORK_FLOW_EDGE,
  WORK_FLOW_FORM,
  WORK_FLOW_NODE,
} from "./urls";

const token = localStorage.getItem("token");

export async function listWorkFlowNodes(id: string | undefined) {
  return fetch(`${GET_PROCESS_DETAILS}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export async function createWorkFlowNode(
  // reactFlowInstance: ReactFlowInstance,
  // reactFlowWrapper: any,
  // event: any,
  // process: any
  { id, ...payload }: any
): Promise<Node> {
  return new Promise((resolve) => {
    try {
      // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const newNode = {
        ...payload,
        // type: CustomNodeTypes.WORKFLOWNODE,
        // data: { label: "New Node" },
        // position: reactFlowInstance.project({
        //   x: event.x - reactFlowBounds.left,
        //   y: event.y - reactFlowBounds.top,
        // }),
        width: payload.style?.width || 316,
        height: payload.style?.height || 51,
        color: payload.style?.color || "#fffff",
      };
      const token = localStorage.getItem("token");

      fetch(WORK_FLOW_NODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newNode),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    } catch (e) {}
  });
}

export async function createResizable(
  // reactFlowInstance: ReactFlowInstance,
  // reactFlowWrapper: any,
  // event: any,
  // process: any
  { id, ...payload }: any
): Promise<Node> {
  return new Promise((resolve, reject) => {
    try {
      // const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const newNode = {
        ...payload,
        // type: CustomNodeTypes.WORKFLOWNODE,
        // data: { label: "New Node" },
        // position: reactFlowInstance.project({
        //   x: event.x - reactFlowBounds.left,
        //   y: event.y - reactFlowBounds.top,
        // }),
        width: payload.style?.width || 316,
        height: payload.style?.height || 51,
        color: payload.style?.backgroundColor || "#fffff",
        connectable: true,
      };
      const token = localStorage.getItem("token");

      fetch(RESIZABLE_NODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(newNode),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    } catch (e) {}
  });
}

export async function updateWorkFlowNode(node: any) {
  fetch(
    `${
      node.type === CustomNodeTypes.WORKFLOWNODE ||
      node.type === CustomNodeTypes.BRANCHNODE
        ? WORK_FLOW_NODE
        : RESIZABLE_NODE
    }${node?.id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(node),
    }
  )
    .then((response) => response.json())
    .then((data) => {});
}

export async function patchWorkFlowNode(node: any) {
  const response = await fetch(
    `${
      node.type === CustomNodeTypes.WORKFLOWNODE
        ? WORK_FLOW_NODE
        : RESIZABLE_NODE
    }${node?.id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(node),
    }
  );

  // Check for HTTP errors
  if (!response.ok) {
    const errorData = await response.json(); // Parse error response for details
    throw new Error(JSON.stringify(errorData));
  }

  return await response.json(); // Parse the success response
}

export async function deleteWorkFlowNode(nodeId: string) {
  fetch(`${WORK_FLOW_NODE}${nodeId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export async function getBranchNodeOptions(edgeId: string) {
  return fetch(`${GET_BRANCH_NODE_DETAILS}/${edgeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getMasterConditionList(BranchNodeId: string) {
  return fetch(`${GET_CONDITION_MASTER_LIST}/${BranchNodeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function postConditionMaster(payload: any) {
  return fetch(`${POST_CONDITION_MASTER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function postBranchNodeOptions(edgeId: string, conditions: any) {
  return fetch(`${GET_BRANCH_NODE_DETAILS}/${edgeId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(conditions),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getConditionsByField(formId: string, field_id: string) {
  return fetch(`${GET_BRANCH_NODE_CONDITION_LIST}/${formId}/${field_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getFieldsByConditionId(condition_uuid: string) {
  return fetch(`${GET_BRANCH_NODE_ELEMENTS_BY_CONDITION}/${condition_uuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function deleteResizableNode(nodeId: string) {
  fetch(`${RESIZABLE_NODE}${nodeId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export async function createWorkFlowEdge(edge: Edge) {
  return fetch(`${WORK_FLOW_EDGE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      // source: edge.source,
      // target: edge.target,
      ...edge,
      label: "Add Action Name",
    }),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function updateWorkFlowEdge(edge: Edge) {
  return fetch(`${WORK_FLOW_EDGE}${edge.id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ ...edge }),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function deleteWorkFlowEdge(edgeId: string) {
  fetch(`${WORK_FLOW_EDGE}${edgeId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export async function createForm(nodeId: string, fields: Array<any>) {
  const reqBody = {
    node: nodeId,
    fields: fields,
  };
  fetch(`${WORK_FLOW_FORM}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(reqBody),
  });
}

export async function getFormPreview(nodeId: string) {
  await fetch(`${GET_WORKFLOW_FORMFIELDS}/${nodeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// code to get form by node id
export async function getFormByNodeId(nodeId: string) {
  try {
    const response = await fetch(`${GET_WORKFLOW_FORMFIELDS}/${nodeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getNotificationActionList(nodeId: string) {
  try {
    const response = await fetch(`${NODE_EDGE_LIST}${nodeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getNotificationList() {
  return fetch(`${GET_NOTIFICATION_LIST}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getNotificationUsers() {
  return fetch(`${GET_NOTIFICATION_USERS}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getNotificationMethods() {
  return fetch(`${GET_NOTIFICATION_METHODS}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function postProcess(payload: any) {
  return fetch(`${CREATE_PROCESS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data);
}

// *************************************** Category API ***************************************
export async function CreateCategories(payload: any) {
  return fetch(`${CREATE_CATEGORY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data);
}

// *************************************** INBOX Filters API ***************************************
export async function getFilterList() {
  return fetch(`${GET_FILTER_LIST}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function addFilter(payload: any) {
  return fetch(`${ADD_FILTER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUserFilter() {
  return fetch(`${GET_USER_FILTER}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function deleteFilter(filterId: string) {
  return fetch(`${DELETE_FILTER}/${filterId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function updateFilter(payload: any) {
  return fetch(`${UPDATE_FILTER}${payload.uuid}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function PostValidateProcess(payload: any) {
  try {
    const response = await fetch(VALIDATE_PROCESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function PostPublishProcess(payload: any) {
  try {
    const response = await fetch(PUBLISH_PROCESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.error}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchPublishChanges(payload: any) {
  try {
    const response = await fetch(GET_PUBLISH_CHANGES_PROCESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${data}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

//  ++++++++++++++++++++++++++++ Template ++++++++++++++++++++++++++++++++
export async function createTemplate(noideId: string, payload: any) {
  try {
    const response = await fetch(`${TEMPLATE}/${noideId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${data}`);
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function getTemplates() {
  return fetch(`${TEMPLATE}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getTemplateDetails(uuid: string) {
  return fetch(`${TEMPLATE_DETAILS}/${uuid}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function fetchTableList(searchQuery = "", sorting = {}) {
  try {
    const url = new URL(GET_TABLE_LIST);

    const params = new URLSearchParams({
      search: searchQuery,
      lang:  searchQuery ? localStorage.getItem("locale") ?? "" : "",
      ...sorting,
    });
    url.search = params.toString();    

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching table list:", error);
    throw error;
  }
}

export async function fetchColumnList(id: string) {
  try {
    const response = await fetch(BASE_URL + `/api/fe/tables/${id}/columns/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchColumnValues(tableId: string, searchQuery = "") {
  try {
    const url = new URL(BASE_URL + `/api/fe/dropdown-values/${tableId}/`);

    if (searchQuery) {
      url.searchParams.append("search", searchQuery);
      url.searchParams.append("lang", localStorage.getItem("locale") ?? "");
    }
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchColumnValuesByParent(
  tableId: string,
  value?: string
) {
  try {
    const response = await fetch(
      BASE_URL + `/api/fe/dropdown-values/${tableId}/?parent_value_id=${value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchDependantTables(parentId: string) {
  try {
    const response = await fetch(
      BASE_URL + `/api/fe/dependent-tables/${parentId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchRequirementDocuments(processId: string) {
  try {
    const response = await fetch(GET_FORM_REQUIRED_DOCUMENTS + processId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function getProcessVersionList(processId: string) {
  try {
    const response = await fetch(`${GET_PROCESS_VERSIONS}/${processId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getNodeUserFilterList(type: "Department" | "Group") {
  try {
    const response = await fetch(
      type === "Department"
        ? GET_NODE_USER_DEPARTMENT__FILTER_LIST
        : GET_NODE_USER_GROUP_FILTER_LIST,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getNodeUsers(
  type: "Department" | "Group",
  id: number | string
) {
  try {
    const response = await fetch(
      type === "Department"
        ? GET_NODE_USER_GROUP_FILTER_LIST
        : GET_NODE_USER_BY_GROUP + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export function getUserFilteredList(nodeId: string, type: string, id: string) {
  return fetch(
    `${LIST_NODE_USERS}/${nodeId}?${
      type === "department" ? "department_id" : "group_id"
    }=${id || "all"}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => data);
}

export async function getUserGroups() {
  try {
    const response = await fetch(GET_GROUPS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getWorkflowNodes(processId: string) {
  try {
    const response = await fetch(GET_WORKFLOW_NODES + processId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getNotificationHeirarchyList(search: string) {
  try {
    const url = new URL(GET_NOTIFICATION_LIST_HEIRARCHY + search);

    if (search) {
      url.searchParams.append("search", search);
    }

    const response = await fetch(url?.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function createTemplateFlow(processId: string, payload: any) {
  try {
    const response = await fetch(`${CREATE_TEMPLATE}${processId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${data}`);
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function applyTemplate(processId: string, templateId: string) {
  try {
    const response = await fetch(
      `${APPLY_TEMPLATE}${processId}/apply-template/${templateId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${data}`);
    }
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function getTemplateList() {
  try {
    const response = await fetch(TEMPLATE_LIST, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}

export async function getTemplateProcessDetails(templateId: string) {
  try {
    const response = await fetch(TEMPLATE_PROCESS_DETAIL + templateId + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching form: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}
