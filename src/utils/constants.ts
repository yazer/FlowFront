const BACKGROUND_OPACITY = "CC"; //20%

export const backgroundColors: { [key: string]: string } = {
  sky: "#D3E3FF" + BACKGROUND_OPACITY,
  lightBlue: "#A3C9FF" + BACKGROUND_OPACITY,
  lightPurple: "#E9CEFF" + BACKGROUND_OPACITY,
  deepPurple: "#A259FF" + BACKGROUND_OPACITY,
  orange: "#FBAB32" + BACKGROUND_OPACITY,
  lime: "#CFEF72" + BACKGROUND_OPACITY,
};

export const formattedDate = (date: any) => {
  const dateString = new Date(date);
  const formattedDate = dateString.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "2-digit",
  });
  return formattedDate;
};

export function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
    reader.onerror = (error: any) => reject(error);
    reader.readAsDataURL(file); // Read the file as a data URL
  });
}

export const pagePreferencesList = [
  {
    name: "Home",
    route: "/home",
  },
  {
    name: "Inbox (InProgress)",
    route: "/inbox/inprogress",
  },
  {
    name: "Inbox (Completed)",
    route: "/inbox/completed",
  },
  {
    name: "Flow builder",
    route: "/process-list-v2",
  },
  {
    name: "Admin Organization",
    route: "/administration/organization",
  },
  {
    name: "Organization Branch",
    route: "/administration/organization-branch",
  },
  {
    name: "Organization Users",
    route: "/administration/user-list",
  },
  {
    name: "Organization Processes",
    route: "/administration/processes",
  },
  {
    name: "Organization Requests",
    route: "/administration/requests",
  },
  {
    name: "Organization Categories",
    route: "/administration/categories",
  },
  {
    name: "Organization User Groups",
    route: "/administration/user-groups",
  },
  {
    name: "Organization Trash",
    route: "/administration/trash",
  },
];
