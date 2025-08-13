import {
  BRANCH_URL,
  CATEGORY_URL,
  CREATE_BRANCH,
  CREATE_DEPARTMENT,
  CREATE_SECTION,
  DEPARTMENT_URL,
  GET_ADMINISTRATION_PROCESS,
  GET_ADMINISTRATION_PROCESS_DETAILS,
  GET_ADMINISTRATION_REQUEST,
  GET_ADMINISTRATION_REQUEST_DETAILS,
  GET_CATEGORY_URL_BY_DEPARTMENT,
  GET_DEPARTMENT_URL,
  GET_ORGANIZATION_DETAILS,
  GET_SECTION_DETAILS,
  GET_STAFF_ORGANIZATION,
  GROUP_URL,
  PROCESS_LIST_URL,
  TRASH,
} from "./urls";

const token = localStorage.getItem("token");

export async function fetchAdminProcessList(
  page: number,
  pageSize: number,
  searchQuery = "",
  branch?: string,
  department?: string,
  section?: string,
  category?: string,
  process?: string,
  sorting: any = {}
) {
  try {
    const url = new URL(GET_ADMINISTRATION_PROCESS);

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      branch: branch || "",
      dept: department || "",
      section: section || "",
      category: category || "",
      process: process || "",
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

export async function fetchAdminRequestList(
  page: number,
  pageSize: number,
  searchQuery = "",
  branch?: string,
  department?: string,
  section?: string,
  category?: string,
  process?: string,
  sorting: any = {}
) {
  try {
    const url = new URL(GET_ADMINISTRATION_REQUEST);

    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      branch: branch || "",
      dept: department || "",
      section: section || "",
      category: category || "",
      process: process || "",
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

export async function fetchAdminProcessDetails(id: any) {
  try {
    const response = await fetch(`${GET_ADMINISTRATION_PROCESS_DETAILS}${id}`, {
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

export async function fetchAdminRequestDetails(id: any) {
  try {
    const response = await fetch(
      `${GET_ADMINISTRATION_REQUEST_DETAILS}/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

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

export async function fetchCategories(
  page: number = 1,
  pageSize: number = 100,
  searchQuery = "",
  sorting: any = {}
) {
  const url = new URL(CATEGORY_URL);

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    search: searchQuery,
    lang: searchQuery ? localStorage.getItem("locale") ?? "" : "",
    ...sorting,
  });

  url.search = params.toString();
  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchCategoriesHome(department: string, search?: string) {
  const url = new URL(GET_CATEGORY_URL_BY_DEPARTMENT + department);
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  url.search = params.toString();
  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchCategoriesFilter(search?: string) {
  const url = new URL(GET_CATEGORY_URL_BY_DEPARTMENT);
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  url.search = params.toString();
  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchDeparments(
  branchId = "",
  page: number,
  pageSize: number,
  searchQuery = "",
  sorting = { sort: "", direction: "asc" }
) {
  const url = new URL(DEPARTMENT_URL + branchId);

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    search: searchQuery,
    lang: searchQuery ? localStorage.getItem("locale") ?? "" : "",
    ...sorting,
  });

  url.search = params.toString();

  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchBranches(
  page: number,
  pageSize: number,
  searchQuery = "",
  sorting = { sort: "", direction: "asc" }
) {
  try {
    const url = new URL(BRANCH_URL);

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

export async function fetchSectionDetails(
  id: any,
  page: number,
  pageSize: number,
  searchQuery = "",
  sorting = { sort: "", direction: "asc" }
) {
  try {
    const url = new URL(`${GET_SECTION_DETAILS}${id}`);

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

export async function fetchDeparmentsHome(search?: string) {
  const url = new URL(GET_DEPARTMENT_URL);

  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  url.search = params.toString();

  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchUserGroups() {
  try {
    const response = await fetch(GROUP_URL, {
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

export async function fetchUserGroupByID(id: any) {
  try {
    const response = await fetch(GROUP_URL + "/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      // If the response is not ok, throw an error with the status text
      throw new Error(`HTTP error! status: ${data}`);
    }

    return data;
  } catch (error) {
    // Log the error and rethrow it so it can be handled by the caller
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchStaffs(
  page: number,
  pageSize: number,
  search = "",
  sorting = { sort: "", direction: "asc" }
) {
  const url = new URL(GET_STAFF_ORGANIZATION);

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    search: search,
    lang: search ? localStorage.getItem("locale") ?? "" : "",
    ...sorting,
  });

  url.search = params.toString();

  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchOrganizationDetails() {
  try {
    const response = await fetch(GET_ORGANIZATION_DETAILS, {
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

export async function fetchBranchesFilter(searchQuery = "") {
  try {
    const url = new URL(BRANCH_URL);

    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    url.search = params.toString();
    const response = await fetch(url?.toString(), {
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

export async function fetchProcessFilter(searchQuery = "") {
  try {
    const url = new URL(PROCESS_LIST_URL);

    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    url.search = params.toString();
    const response = await fetch(url?.toString(), {
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

export async function fetchDeparmentsFilter(
  branchId: string,
  searchQuery = ""
) {
  const url = new URL(DEPARTMENT_URL + branchId);

  const params = new URLSearchParams();

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  url.search = params.toString();

  try {
    const response = await fetch(url?.toString(), {
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

export async function fetchSectionDetailsFilter(
  departmentId: any,
  searchQuery = ""
) {
  try {
    const url = new URL(`${GET_SECTION_DETAILS}${departmentId}`);

    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    url.search = params.toString();
    const response = await fetch(url?.toString(), {
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

export async function CreateDepartment(payload: any) {
  const response = await fetch(`${CREATE_DEPARTMENT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function CreateBranch(payload: any) {
  const response = await fetch(`${CREATE_BRANCH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function UpdateBranch(id: string, payload: any) {
  const response = await fetch(`${CREATE_BRANCH}` + id + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function DeleteBranch(id: string = "") {
  const response = await fetch(`${CREATE_BRANCH}` + id + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting resource: ${response.statusText}`);
  }
  // Some APIs return a body, some don't
  try {
    const data = await response.json();
    return data;
  } catch {
    return true; // If no JSON, just return true for success
  }
}

export async function CreateSection(payload: any) {
  const response = await fetch(`${CREATE_SECTION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function CreateMethod(url: string, payload: any) {
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function UpdateMethod(url: string, id: string, payload: any) {
  const response = await fetch(`${url}` + id + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function DeleteMethod(url: string, id: string = "") {
  const response = await fetch(`${url}` + id + "/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error deleting resource: ${response.statusText}`);
  }
  // Some APIs return a body, some don't
  try {
    const data = await response.json();
    return data;
  } catch {
    return true; // If no JSON, just return true for success
  }
}

export async function fetchTrashList(
  page: number,
  pageSize: number,
  searchQuery = "",
  sorting: any = {}
) {
  try {
    const url = new URL(TRASH);
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
