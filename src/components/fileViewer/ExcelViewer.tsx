// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import ExcelViewer from "excel-viewer";
import { CircularProgress, Stack } from "@mui/material";
// import axios from "axios";

interface ExcelViewerComponentProps {
  fileUrl: string;
  theme?: "light" | "dark";
  lang?: string;
  authToken?: string;
}

const ExcelViewerComponent: React.FC<ExcelViewerComponentProps> = ({
  fileUrl,
  theme = "light",
  lang = "en",
  authToken,
}) => {
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileUrl || !viewerRef.current) return;

    const loadExcel = async () => {
      try {
        let source = fileUrl;
        setLoading(true);
        new ExcelViewer(viewerRef.current, source, { theme, lang });
      } catch (error) {
        console.error("Error loading Excel file:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, [fileUrl, theme, lang, authToken]);

  return (
    <>
      {loading && (
        <Stack alignItems="center" height={"100%"} justifyContent="center">
          <CircularProgress />
        </Stack>
      )}
      <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />
    </>
  );
};

export default ExcelViewerComponent;
