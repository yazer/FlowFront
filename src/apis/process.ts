import {
  WORK_FLOW_CATEGORIES,
  WORK_FLOW_PROCESS,
  WORK_FLOW_REQUEST,
  WORK_CREATE_TRACK,
  GET_PROCESS_LANGUAGE,
  FAVORITE_URL,
  PROCESS_DETAILS,
  BASE_URL,
  GET_PROCESS_VERSIONS,
  GET_ADMINISTRATION_PROCESS_VERSION,
} from "./urls";
const token = localStorage.getItem("token");

export async function listProcess(
  isfavorite?: string,
  category?: string,
  paginationState?: { pageNumber?: number; pageSize?: number },
  search = "",
  filters?: {
    branch?: string;
    department?: string;
    section?: string;
    category?: string;
    sortQuery?: string;
  }
) {
  try {
    const params = new URLSearchParams();

    if (isfavorite) params.append("isfavorite", isfavorite);
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    if (search) params.append("lang", localStorage.getItem("locale") ?? "");
    if (filters?.branch) params.append("branch", filters.branch);
    if (filters?.department) params.append("department", filters.department);
    if (filters?.section) params.append("section", filters.section);
    if (filters?.category) params.append("category", filters.category);

    if (paginationState?.pageNumber)
      params.append("page", paginationState.pageNumber.toString());
    if (paginationState?.pageSize)
      params.append("page_size", paginationState.pageSize.toString());

    const url = `${WORK_FLOW_PROCESS}${
      params.toString()
        ? `?${params}${filters?.sortQuery ? "&" + filters.sortQuery : ""}`
        : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching process list:", error);
    throw error;
  }
}

export async function listProcessDashboard(
  isfavorite?: any,
  category?: any,
  paginationState?: any,
  department?: any,
  branch?: any,
  section?: any,
  search?: string
) {
  const params = new URLSearchParams();

  if (isfavorite) params.append("isfavorite", isfavorite);
  if (category) params.append("category", category);
  if (department) params.append("dept", department);
  if (branch) params.append("branch", branch);
  if (section) params.append("section", section);
  if (search) params.append("search", search || "");
  if (search) params.append("lang", localStorage.getItem("locale") || "");

  const queryString = params.toString();

  try {
    const page = paginationState?.pageNumber;
    const pageSize = paginationState?.pageSize;
    const queryStrings = [];
    if (queryString) queryStrings.push(queryString);
    if (page) queryStrings.push(`page=${page}`);
    if (pageSize) queryStrings.push(`page_size=${pageSize}`);
    const finalQueryString =
      queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
    const url = BASE_URL + `/api/fe/process-list/${finalQueryString}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
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

// export async function listProcess() {
//   return fetch(WORK_FLOW_PROCESS, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Token ${token}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       return data;
//     });
// }

export async function createProcess(formData: any) {
  try {
    const response = await fetch(WORK_FLOW_PROCESS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData),
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

export async function listCategories() {
  return fetch(WORK_FLOW_CATEGORIES, {
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

export async function listLanguages() {
  return fetch(GET_PROCESS_LANGUAGE, {
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

// export async function listCategories() {
//   await fetch(`${BASE_URL}/workflow/category/`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Token ${token}`,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       return data;
//     });
// }

export async function processRequest(payload: any) {
  return await fetch(WORK_FLOW_REQUEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

export async function processDetail(processId: string) {
  const url = `${WORK_FLOW_PROCESS}${processId}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    // body: JSON.stringify(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

export async function fetchProcessFormDetail(processId: string) {
  const url = `${BASE_URL}/api/fe/get-form-actions/${processId}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    // body: JSON.stringify(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

export async function createTrack(
  processId: string,
  actionUuid: string,
  nodeUuid: string,
  formState: any
) {
  const url = `${WORK_CREATE_TRACK}`;
  const formData = new FormData();

  // Append the non-file fields to FormData
  formData.append("processId", processId);
  formData.append("actionUuid", actionUuid);
  formData.append("nodeUuid", nodeUuid);

  // Append each field in formState to FormData, handling files and undefined values
  Object.entries(formState).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        // If the value is a File, add it directly
        formData.append(key, value);
      } else {
        // If it's not a file, convert objects to JSON strings, otherwise add as string
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value.toString()
        );
      }
    }
  });

  // Send the FormData using fetch with the required headers
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`, // Only set authorization; Content-Type is handled by FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in createTrack:", error);
    throw error;
  }
}

export async function CreateFavorite(payload: any) {
  try {
    const response = await fetch(FAVORITE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`${data?.detail}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function removeFavorite(id: string | number) {
  const url = `${FAVORITE_URL}${id}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.detail || `Failed to remove favorite: ${response.statusText}`
      );
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}

export async function fetchProcessDetails(id: any) {
  try {
    const response = await fetch(PROCESS_DETAILS + id, {
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

export async function fetchProcessVersions(
  id: any,
  page: number,
  pageSize: number,
  searchQuery = "",
  sorting: any
) {
  try {
    const url = new URL(GET_ADMINISTRATION_PROCESS_VERSION + id);

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      search: searchQuery,
      lang: searchQuery ? localStorage.getItem("locale") ?? "" : "",
      ...sorting,
    });

    url.search = params.toString();

    const response = await fetch(url?.toString(), {
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
