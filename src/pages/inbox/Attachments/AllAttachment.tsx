import { Close, Download } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import FileViewer from "../../../components/fileViewer/FileViewer";
import CheckBox from "../../../components/FormElements/newcompnents/Addons/CheckBox";
import AttachmentListItem, { iconsMap } from "./AttachmentListItem";

type allAttachmenttype = {
  open: boolean;
  onClose: () => void;
  data: any[];
  isAllAttachment?: boolean;
};
function AllAttachment({ data, open, onClose }: allAttachmenttype) {
  const theme: any = useTheme();

  const { locale } = useIntl();
  const [selectedFile, setSelectedFile] = React.useState("");
  const [downloadMultiple, setDownloadMultiple] = React.useState(false);
  const [selectedLinks, setSelectedLinks] = React.useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setSelectedFile(
        data?.[0]?.attachments?.[0]?.file_url ||
          data?.[0]?.attachments?.[0]?.value
      );
    }
  }, [data]);

  function handleClick(url: string) {
    setSelectedFile(url);
  }

  function getFileNameFromUrl(url: string) {
    if (url && typeof url === "string") {
      const parts = url?.split("/") ?? [];
      return parts?.[parts?.length - 1] ?? "";
    }
    return "";
  }

  function getFileTypeFromUrl(url: string) {
    if (url) {
      // const fileName = getFileNameFromUrl(url);
      // const parts = fileName?.split(".") ?? [];
      // return parts?.[parts.length - 1] ?? "";
      return url;
    }
  }

  console.log("selected links", selectedLinks);
  function downloadMultipleFiles() {
    selectedLinks.forEach((link, index) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = link;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 500);
    });
  }

  return (
    <>
      <AttachmentDrawer open={open} onClose={onClose}>
        <Grid container height={"100%"}>
          <Grid item md={8.5}>
            <Stack
              alignItems="center"
              direction="row"
              padding={1}
              paddingBottom={0}
              borderBottom={`1px solid ${theme.palette.border.main}`}
              borderRight={`1px solid ${theme.palette.border.main}`}
              paddingLeft={2}
            >
              {/* @ts-ignore */}
              {iconsMap[getFileTypeFromUrl(selectedFile)] || iconsMap.default}
              <Typography variant="h5" padding={1.3}>
                {getFileNameFromUrl(selectedFile)}
              </Typography>
            </Stack>
            <Box
              height={"calc(100vh - 90px)"}
              overflow="auto"
              width={"100%"}
              borderRight={`1px solid ${theme.palette.border.main}`}
            >
              <FileViewer
                // height={200}
                filepath={selectedFile}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Box>
              <Stack
                alignItems="center"
                justifyContent="space-between"
                direction="row"
                padding={1}
                paddingBottom={0}
                borderBottom={`1px solid ${theme.palette.border.main}`}
              >
                <Typography variant="h5">Documents</Typography>
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Stack>
              {/* ++++++++++++++++++++++++++++++ Preview ++++++++++++++++++++++++++++++++++ */}
              <Box padding={1.5} paddingBottom={0}>
                <Stack
                  spacing={0.5}
                  marginTop={1}
                  paddingRight={1}
                  sx={{
                    height: "calc(100vh - 110px)",
                    overflow: "auto",
                  }}
                  gap={2}
                >
                  <CheckBox
                    label={"Download multiple attachments"}
                    onChange={function (e: any): void {
                      setDownloadMultiple(e.target.checked);
                    }}
                    isChecked={downloadMultiple}
                  />

                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<Download />}
                    onClick={downloadMultipleFiles}
                  >
                    Download {selectedLinks.length}
                  </Button>
                  {downloadMultiple ? (
                    <CheckBox
                      label={"Select All"}
                      onChange={function (e: any): void {}}
                    />
                  ) : null}
                  <>
                    {data?.map((item) => (
                      <>
                        <div>
                          <Typography mb={1}>
                            Workflow Name :{" "}
                            <span className="text-black font-bold">
                              {item?.translation?.name?.[locale] ||
                                item?.translation?.[locale]?.workflow}
                            </span>
                          </Typography>
                          <Stack gap={1}>
                            {item?.attachments?.map((el: any) => (
                              <AttachmentListItem
                                fileObj={el}
                                fileUrl={el?.file_url || el?.value}
                                onClick={handleClick}
                                selected={
                                  el?.file_url === selectedFile ||
                                  el?.value === selectedFile
                                }
                                isMultipleDownload={downloadMultiple}
                                onCheckboxChange={(e, url) => {
                                  setSelectedLinks((urls) => {
                                    return urls.includes(url)
                                      ? urls.filter((u) => u !== url)
                                      : [...urls, url];
                                  });
                                }}
                              />
                            ))}
                          </Stack>
                        </div>
                        <Divider flexItem></Divider>
                      </>
                    ))}
                  </>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </AttachmentDrawer>
    </>
  );
}

export default AllAttachment;

type drawertypes = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function AttachmentDrawer({ open, onClose, children }: drawertypes) {
  return (
    // <Dialog
    //   fullScreen
    //   open={open}
    //   onClose={onClose}
    //   TransitionComponent={Transition}
    // >
    <>{children}</>
    // </Dialog>
  );
}
