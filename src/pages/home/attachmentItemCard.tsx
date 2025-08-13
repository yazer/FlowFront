import { Icon } from "@iconify/react";
import { ArrowDownward } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

export const iconsMap = {
  jpg: <Icon icon="flat-color-icons:image-file" />,
  jpeg: <Icon icon="flat-color-icons:image-file" />,
  png: <Icon icon="flat-color-icons:image-file" />,
  docx: <Icon icon="vscode-icons:file-type-word" />,
  pdf: <Icon icon="vscode-icons:file-type-pdf2" />,
  xlsx: <Icon icon="vscode-icons:file-type-excel" />,
  xls: <Icon icon="vscode-icons:file-type-excel" />,
  csv: <Icon icon="vscode-icons:file-type-excel" />,
  mp4: <Icon icon="mynaui:video" />,
  mp3: <Icon icon="ic:outline-audio-file" />,
  default: <Icon icon="ant-design:file-unknown-outlined" />,
};

function AttachmentListItem({
  fileUrl = "",
  onClick,
  selected,
  fileObj,
  isMultipleDownload,
  onCheckboxChange,
}: {
  fileUrl: string;
  onClick?: (url: string) => any;
  selected?: boolean;
  fileObj: any;
  isMultipleDownload?: boolean;
  onCheckboxChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    fileUrl: string
  ) => any;
}) {
  const theme = useTheme();
  const filename = fileUrl?.split("/")?.pop() || "";
  const fileType = filename?.split(".")?.pop() || "";

  return (
    <div className="flex flex-col gap-2">
      <Typography
        noWrap
        variant="h5"
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        color={
          selected ? theme.palette.primary.main : theme.palette.text.primary
        }
      >
        <strong>Document Type</strong> : {fileObj.document_type}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        padding={1}
        alignItems="center"
        component="div"
        onClick={() => onClick && onClick(fileUrl)}
        maxWidth={"100%"}
        sx={{
          cursor: "pointer",
          borderRadius: 1,
          backgroundColor: selected
            ? theme.palette.action.selected
            : "transparent",
          ":hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        justifyContent="space-between"
        className="border"
      >
        <Stack sx={{ "& svg": { height: 30, width: 30 } }}>
          {/* @ts-ignore */}
          {iconsMap[fileType] || iconsMap.default}
        </Stack>

        <Stack flex={1} maxWidth={"70%"}>
          <Tooltip title={filename}>
            <Typography
              noWrap
              variant="h5"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              color={
                selected
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }
            >
              {filename}
            </Typography>
          </Tooltip>
          <Stack direction="row" gap={1}>
            {/* <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            {formattedDate(fileObj?.uploaded_at)}
          </Typography>
          <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            {fileObj?.uploaded_by}
          </Typography> */}
          </Stack>
        </Stack>
        <IconButton size="small">
          <a
            href={fileUrl ?? ""}
            download={filename}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <ArrowDownward sx={{ height: 14, width: 14 }} />
          </a>
        </IconButton>
      </Stack>
    </div>
  );
}

export default AttachmentListItem;
