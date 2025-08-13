import { Edge, Node, ReactFlowInstance } from "reactflow";
import { CustomNodeTypes } from "../utils/customFlowItems";
import {
  GET_ORGANIZATION,
  LIST_NODE_USERS,
  ORGANIZATION_HEIRARCHY,
  ORGANIZATION_HEIRARCHY_EDGE,
  UPDATE_ORGANIZATION_BASIC_DETAILS,
} from "./urls";

// Define the structure of a node based on the response
interface OrganizationNode {
  id: number;
  uuid: string;
  label: string;
  description: string | null;
  color: string | null;
  width: number | null;
  height: number | null;
  type: string;
  x_axis: string | null;
  y_axis: string | null;
  created_at: string;
  updated_at: string;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  create_by: number | null;
  organization: number;
  parent: number | null;
}

export const token = localStorage.getItem("token");

export async function createOrgPosition(
  reactFlowInstance: ReactFlowInstance,
  reactFlowWrapper: any,
  event: React.MouseEvent
): Promise<Node> {
  return new Promise((resolve, reject) => {
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    const newNode = {
      type: CustomNodeTypes.DEFAULT,
      data: { label: "New Node" },
      position: reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }),
      width: 316,
      height: 51,
    };
    fetch(ORGANIZATION_HEIRARCHY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ node: newNode }),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data?.node);
      });
  });
}

export async function deleteOrgPosition(nodeId: string) {
  fetch(`${ORGANIZATION_HEIRARCHY}${nodeId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}
export async function updateOrgPosition(node: any) {
  fetch(`${ORGANIZATION_HEIRARCHY}${node?.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ node: node }),
  })
    .then((response) => response.json())
    .then((data) => {});
}

export async function createOrgPositionEdge(edge: Edge) {
  fetch(`${ORGANIZATION_HEIRARCHY_EDGE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ source: edge.source, target: edge.target }),
  })
    .then((response) => response.json())
    .then((data) => {});
}

export async function deleteEdge(edgeId: string) {
  fetch(`${ORGANIZATION_HEIRARCHY_EDGE}${edgeId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
}

export async function listOrganizationStaffs(selectedNodeId: string) {
  try {
    const response = await fetch(`${LIST_NODE_USERS}/${selectedNodeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createNodeUser(selectedNodeId: string, staffArray: any) {
  try {
    const response = await fetch(LIST_NODE_USERS + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ node: selectedNodeId, staff: staffArray }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchOrganizationHierarchy(): Promise<string[]> {
  try {
    const response = await fetch(ORGANIZATION_HEIRARCHY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure the hierarchy nodes are typed correctly
    const nodes: OrganizationNode[] = data.hierarchy.nodes[0];

    // Extract labels from the hierarchy nodes
    const labels = nodes.map((node: OrganizationNode) => node.label);
    return labels;
  } catch (error) {
    console.error("Error fetching organization hierarchy:", error);
    throw error;
  }
}

export async function updateOraganization(payload: any) {
  const response = await fetch(UPDATE_ORGANIZATION_BASIC_DETAILS, {
    method: "PUT",
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`,
    },
    body: payload,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function fetchOrganization() {
  try {
    const response = await fetch(GET_ORGANIZATION, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      // If the response is not ok, throw an error with the status text
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error and rethrow it so it can be handled by the caller
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}
