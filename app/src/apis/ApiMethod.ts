const token = localStorage.getItem("token");

export async function getMethod(url: any) {
  try {
    const response = await fetch(url?.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    const contentType = response.headers.get("Content-Type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw data?.error || response.statusText;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function putMethod<T>(url: string, body: T) {
  try {
    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;
    if (!response.ok) {
      throw data || response.statusText;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function putMethodwithFormData<T>(url: string, body: FormData) {
  try {
    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Token ${token}`,
      },
      body: body,
    });

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;
    if (!response.ok) {
      throw data || response.statusText;
    }
    return data;
  } catch (error) {
    console.error("Error updating resource:", error);
    return null;
  }
}

export async function postMethod<T extends BodyInit | null | undefined>(
  url: string,
  body: any
) {
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(body),
    });
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;
    if (!response.ok) {
      throw data?.error || response.statusText;
    }
    return data;
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
}

export async function postMethodWithFormData<T>(url: string, body: FormData) {
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: body,
    });
    const data = await response.json();
    if (!response.ok) {
      throw data?.error || response.statusText;
    }
    return data;
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
}

export async function deleteMethod(url: string, body?: any) {
  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage =
        data?.error || `Delete request failed with status ${response.status}`;
      throw errorMessage;
    }

    return data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error; // re-throw so the calling function knows it's an error
  }
}

export async function getMethodWithToken(url: string, token: string) {
  try {
    const response = await fetch(url?.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json(); // Parse the response
    if (!response.ok) {
      throw data.error || response.statusText;
    }

    return data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching form fields:", error);
    return null; // Handle the error by returning null or appropriate error data
  }
}
