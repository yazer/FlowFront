import React from "react";

type fileType = {
  id: string | number; // Unique identifier for the file, can be a string or number
  progress: number;
  name: string;
  status: "progress" | "success" | "error";
  reason?: string; // Optional reason for error status
};

type UploadProgressContextType = {
  files: fileType[];
  setFiles: React.Dispatch<React.SetStateAction<fileType[]>>;
};

const UploadProgressContext = React.createContext<
  UploadProgressContextType | undefined
>(undefined);

function UploadProgressProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = React.useState<fileType[]>([]);
  return (
    <UploadProgressContext.Provider value={{ files, setFiles }}>
      {children}
    </UploadProgressContext.Provider>
  );
}

export default UploadProgressProvider;

export const useUploadProgress = (): UploadProgressContextType => {
  const context = React.useContext(UploadProgressContext);
  if (!context) {
    throw new Error(
      "useUploadProgress must be used within an UploadProgressProvider"
    );
  }
  return context;
};
