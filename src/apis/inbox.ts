import {
  GET_ATTACHMENT_BY_REQUEST,
  GET_INBOX_DETAILS_COMPLETED,
  GET_INBOX_DETAILS_INPROGRESS,
  GETINBOX,
  GETINBOXDETAILS,
  GETINBOXTRACKHISTORY,
  INBOX_IS_READ,
  PROCESS_NEXT_TRACK,
  PROCESS_TRACK,
} from "./urls";
const token = localStorage.getItem("token");

export async function listInbox(
  category = "completed",
  query: string = "",
  selectedFilter: any = "",
  startDate: any = "",
  endDate: any = ""
) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (query) params.append("query", query);
  if (selectedFilter) params.append("filter", selectedFilter);
  if (startDate) params.append("start-date", startDate);
  if (endDate) params.append("end-date", endDate);

  const url = `${GETINBOX}?${params.toString()}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch inbox items");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching inbox:", error);
      throw error;
    });
}

export async function inboxDetails(id: any) {
  return fetch(`${GETINBOXDETAILS}${id}`, {
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

export async function inboxTrackHistory(id: any) {
  return fetch(`${GETINBOXTRACKHISTORY}${id}`, {
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

export async function createTrack(formData: any) {
  try {
    const response = await fetch(PROCESS_TRACK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(formData), // Sending the form data as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tracking process:", error);
    throw error; // Handle errors appropriately
  }
}

export async function createNextTrack(
  inboxId: string,
  actionUuid: string,
  formState: any,
  remarks?: string
) {
  const url = `${PROCESS_NEXT_TRACK}`;
  const formData = new FormData();

  // Append the non-file fields to FormData
  formData.append("uuid", inboxId);
  formData.append("actionUuid", actionUuid);
  if (remarks) {
    formData.append("remarks", JSON.stringify(remarks));
  }

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

// code for update track
// export async function updateTrack(formData: any) {
//   try {
//     const url = `${GETINBOXDETAILS}${formData.uuid}/`;
//     const response = await fetch(url, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//       body: JSON.stringify(formData), // Sending the form data as JSON
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error tracking process:", error);
//     throw error; // Handle errors appropriately
//   }
// }

/**
 * Updates an inbox item with the given formData and files (if any)
 * @param {object} formData - Form data (non-file fields)
 * @param {object} files - Object of file inputs and their corresponding File objects
 * @returns {Promise<object>} - Response data (JSON)
 */
export async function updateTrack(formData: any, files: any) {
  try {
    const url = `${GETINBOXDETAILS}${formData.uuid}/`;

    // Create a new FormData object
    const form = new FormData();

    // Append form fields (non-file fields) to FormData
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        // Skip files as they will be handled separately
        form.append(key, formData[key]);
      }
    }

    // Append file data (files should be an object where keys are the file inputs and values are file objects)
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        form.append(key, files[key]); // 'files[key]' should be a File object
      }
    }

    // Send the PUT request with FormData
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
        // Note: Content-Type will automatically be set to multipart/form-data when using FormData
      },
      body: form, // Sending the FormData (multipart)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tracking process:", error);
    throw error; // Handle errors appropriately
  }
}

export async function fetchAttachmentById(requestID: string) {
  try {
    const response = await fetch(`${GET_ATTACHMENT_BY_REQUEST}/${requestID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function setIsRead(trackId: any) {
  try {
    const response = await fetch(INBOX_IS_READ + trackId + "/", {
      method: "POST",
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
    console.error("Error tracking process:", error);
    throw error; // Handle errors appropriately
  }
}

export async function fetchInboxDetails(requestID: string) {
  try {
    const response = await fetch(
      `${GET_INBOX_DETAILS_INPROGRESS}${requestID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}

export async function fetchInboxDetailsCompleted(requestID: string) {
  try {
    const response = await fetch(`${GET_INBOX_DETAILS_COMPLETED}${requestID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail);
    }
    return data;
  } catch (error) {
    console.error("Error fetching inbox details:", error);
    throw error;
  }
}
