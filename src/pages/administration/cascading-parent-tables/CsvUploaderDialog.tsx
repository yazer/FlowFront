import React from "react";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import { Button, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import useTranslation from "../../../hooks/useTranslation";
import { useUploadProgress } from "../../../components/uploadProgress/UploadProgressProvider";
import { postMethodWithFormData } from "../../../apis/ApiMethod";
import { APPEND_CHUNK, UPLOAD_CHUNK } from "../../../apis/urls";

function CsvUploaderDialog({
  open,
  handleClose,
  onSucess,
  tableId,
  tableName: tableNameProp,
}: {
  open: boolean;
  handleClose: () => void;
  onSucess?: () => void;
  tableId?: string | number;
  tableName?: string;
}) {
  const { translate } = useTranslation();
  const [tableName, setTableName] = React.useState<string>(tableNameProp || "");
  const [selectFile, setSelectFile] = React.useState<any>(null);

  const { setFiles } = useUploadProgress();

  async function uploadFileInChunks(file: Blob, chunkSize = 1024 * 1024) {
    // 1 MB chunk size
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = Date.now(); // Unique ID for this file upload
    setFiles((prev) => [
      ...prev,
      { id: uploadId, name: file.name, progress: 0, status: "progress" },
    ]);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file_chunk", chunk);
      formData.append("chunk_index", i.toString());
      formData.append("total_chunks", totalChunks.toString());
      formData.append("upload_id", uploadId.toString());
      formData.append("table_name", tableName);
      tableId && formData.append("table_id", tableId.toString());

      try {
        const data: any = await (async () => {
          try {
            if (tableId) {
              return await postMethodWithFormData(APPEND_CHUNK, formData);
            } else {
              return await postMethodWithFormData(UPLOAD_CHUNK, formData);
            }
          } catch (error) {
            console.error("Error uploading chunk:", error);
            throw error;
          }
        })();

        setFiles((prev) =>
          prev.map((file) =>
            file.id === uploadId
              ? {
                  id: uploadId,
                  name: file.name,
                  progress: data?.progress,
                  status:
                    data.status === "in_progress"
                      ? "progress"
                      : data.status === "complete"
                      ? "success"
                      : "error",
                }
              : file
          )
        );
      } catch (error) {
        console.log(error);
        setFiles((prev) =>
          prev.map((file) =>
            file.id === uploadId
              ? {
                  ...file,
                  status: "error",
                  reason: typeof error === "string" ? error : "Upload failed",
                }
              : file
          )
        );

        break;
      }
    }

    console.log("All chunks uploaded.");
  }

  return (
    <div>
      <DialogCustomized
        open={open}
        content={
          <Stack spacing={2}>
            <InputField
              label={<FormattedMessage id="tableName" />}
              onChange={(e) => {
                setTableName(e);
              }}
              value={tableName}
              disabled={!!tableId}
            />
            <InputField
              label={<FormattedMessage id="selectCSVFile" />}
              type="file"
              onChange={(value, event) => {
                setSelectFile(event.target.files);
              }}
              value={undefined}
              accept=".csv"
            />
          </Stack>
        }
        actions={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" size="small">
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                handleClose();
                uploadFileInChunks(selectFile[0]);
              }}
              disableElevation
            >
              {translate("upload")}
            </Button>
          </Stack>
        }
        title={<FormattedMessage id="uploadCSV" />}
        handleClose={handleClose}
      />
    </div>
  );
}

export default CsvUploaderDialog;
