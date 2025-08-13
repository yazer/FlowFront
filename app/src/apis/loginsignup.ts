import { LOGIN } from "./urls";

export const login = async (payload: any) => {
  return await fetch(LOGIN, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((err: any) => {
      console.log(err);

      throw new Error(err);
    });
};

export async function FetchLoginDetails() {
  try {
    const response = await fetch(LOGIN, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
