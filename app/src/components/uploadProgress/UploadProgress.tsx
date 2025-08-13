import { CheckCircle } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, IconButton } from "@mui/material";
import { useState } from "react";
import { useUploadProgress } from "./UploadProgressProvider";

// export function showUploadToast(fileName: string) {
//   const id = toast.custom((t) => <UploadToast />, {
//     duration: Infinity,
//     position: "bottom-right",
//   });

//   return {
//     update: (progress: number) =>
//       toast.custom(
//         (t) => <UploadToast t={t} fileName={fileName} progress={progress} />,
//         {
//           id,
//           position: "bottom-right",
//         }
//       ),
//     success: () => toast.success(`${fileName} uploaded successfully`, { id }),
//     error: () => toast.error(`Failed to upload ${fileName}`, { id }),
//     dismiss: () => toast.dismiss(id),
//   };
// }

const UploadToast = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { files, setFiles } = useUploadProgress();

  const uploadingcount = files.filter((file) => file.status === "progress");

  if (files.length <= 0) return <></>;
  return (
    <div
      style={{ zIndex: 10000 }}
      className={`rounded-lg shadow-lg bg-white w-80 border border-gray-200  fixed bottom-2 right-16 transition-all duration-300 ${
        collapsed ? "animate-enter" : "animate-leave"
      }`}
    >
      <div
        className={`flex items-center justify-between p-3 py-2 ${
          collapsed ? "" : "border-b border-gray-200"
        }`}
      >
        <div className="text-gray-700 font-medium">
          <span className="text-sm text-gray-800 bold">
            {uploadingcount.length <= 0
              ? "All Completed"
              : `Uploading ${uploadingcount.length} item...`}
          </span>
        </div>
        <div className="flex items-end justify-between ">
          {collapsed ? (
            <IconButton size="small" onClick={() => setCollapsed(false)}>
              <ExpandLess />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={() => setCollapsed(true)}>
              <ExpandMore />
            </IconButton>
          )}
          <IconButton
            size="small"
            disabled={files.some((file) => file.status === "progress")}
            onClick={() => {
              setFiles([]);
            }}
          >
            <Close />
          </IconButton>
        </div>
      </div>

      {/* Collapsed View */}
      <Collapse in={collapsed}>
        <div className="p-3 gap-2 flex flex-col">
          {files.map((file) => (
            <FileUploadProgress
              key={file.name}
              fileName={file.name}
              progress={file.progress}
              type={file.status}
              reason={file?.reason || ""}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default UploadToast;

function FileUploadProgress({
  fileName,
  progress = 0,
  type = "progress",
  reason = "",
}: {
  fileName: string;
  progress?: number;
  type?: "progress" | "error" | "success";
  reason?: string;
}) {
  // This function is not used in the current context, but can be implemented
  // to handle file upload progress updates if needed.
  return (
    <div className="flex items-center bg-white shadow-sm border rounded-lg border-gray-200 gap-1 p-2">
      <div className="flex-1">
        <div className="flex justify-between mb-1 truncate">
          <div
            title={fileName}
            className="font-sm text-gray-700 w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {fileName}&nbsp;
          </div>
          {(() => {
            switch (type) {
              case "success":
                return <div className="text-sm text-gray-500 mt-1">50 MB</div>;
              case "error":
                return (
                  <div title={reason} className="text-sm text-red-500 mt-1">
                    Failed
                  </div>
                );
              case "progress":
              default:
                return (
                  <div className="text-sm text-gray-500 mt-1">{progress}%</div>
                );
            }
          })()}
        </div>
        {(() => {
          switch (type) {
            case "success":
              return (
                <></>
                // <div className="text-sm text-green-600 mt-1">Completed</div>
              );
            case "error":
              return (
                <div className="w-full bg-red-100 rounded h-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-300 rounded-lg"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              );
            case "progress":
            default:
              return (
                <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300 rounded-lg"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              );
          }
        })()}
      </div>
      {(() => {
        switch (type) {
          case "success":
            return (
              <div className="text-sm text-green-500">
                <CheckCircle />
              </div>
            );
          case "error":
            return (
              <></>
              // <IconButton size="small">
              //   <Refresh
              //     sx={{ color: "palette.error", height: "18px", width: "18px" }}
              //   />
              // </IconButton>
            );
          default:
            return (
              <></>
              // <IconButton size="small">
              //   <DeleteOutline
              //     sx={{ color: "grey", height: "18px", width: "18px" }}
              //   />
              // </IconButton>
            );
        }
      })()}
    </div>
  );
}
