import { useEffect, useState } from "react";
import {
  Stack,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
// import { pdfjs, Document, Page } from "react-pdf";

// pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.min.js");

// const options = {
//   cMapUrl: "/cmaps/",
//   standardFontDataUrl: "/standard_fonts/",
// };

const SUPPORTED_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const SUPPORTED_VIDEO_TYPES = ["mp4", "webm", "ogg"];
const SUPPORTED_AUDIO_TYPES = ["mp3", "wav", "ogg"];
const SUPPORTED_TEXT_TYPES = ["txt", "csv", "log", "json"];
const SUPPORTED_PDF = ["pdf"];

function FileViewer({
  filepath,
  height = "100%",
}: {
  filepath: string;
  height?: string;
}) {
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(true);
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    setLoader(true);

    const timeout = setTimeout(() => {
      setLoader(false); // Fallback after 10s
    }, 10000);

    return () => clearTimeout(timeout);
  }, [filepath]);

  useEffect(() => {
    if (!filepath) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    const ext = typeof filepath == "string" ? filepath?.split(".").pop()?.toLowerCase() ?? "" : "";
    setFileType(ext);
    setLoader(true);
  }, [filepath]);

  const renderDownloadButton = () => (
    <a href={filepath} download style={{ textDecoration: "none" }}>
      <Button
        variant="contained"
        startIcon={<ArrowDownward />}
        size="small"
        disableElevation
      >
        Download
      </Button>
    </a>
  );

  const renderLoader = () => (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height={height}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.paper"
      zIndex={1}
    >
      <CircularProgress />
    </Box>
  );

  if (error) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        height={height}
        justifyContent="center"
      >
        <Typography variant="h6">Unable to preview this file</Typography>
        {renderDownloadButton()}
      </Stack>
    );
  }

  // 📄 PDF
  if (SUPPORTED_PDF.includes(fileType)) {
    return (
      // <div className="Example__container__document">
      //   <Document file={filepath} options={options}>
      //     {Array.from(new Array(numPages), (_el, index) => (
      //       <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      //     ))}
      //   </Document>
      // </div>
      <Box position="relative" height={height}>
        {loader && renderLoader()}
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            filepath
          )}&embedded=true`}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          onLoad={() => setLoader(false)}
        />
      </Box>
    );
  }

  // 🖼 Image
  if (SUPPORTED_IMAGE_TYPES.includes(fileType)) {
    return (
      <Box position="relative" height={height}>
        {loader && renderLoader()}
        <img
          src={filepath}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          onLoad={() => setLoader(false)}
          onError={() => setError(true)}
        />
      </Box>
    );
  }

  // 📹 Video
  if (SUPPORTED_VIDEO_TYPES.includes(fileType)) {
    return (
      <Box position="relative" height={height}>
        {loader && renderLoader()}
        <video
          controls
          style={{ maxWidth: "100%", maxHeight: height }}
          onCanPlayThrough={() => setLoader(false)}
          onError={() => setError(true)}
        >
          <source src={filepath} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  }

  // 🔊 Audio
  if (SUPPORTED_AUDIO_TYPES.includes(fileType)) {
    return (
      <Box position="relative" height={height}>
        {loader && renderLoader()}
        <Stack
          spacing={2}
          alignItems="center"
          height={height}
          justifyContent="center"
        >
          <Typography variant="body1">Audio File</Typography>
          <audio
            controls
            onCanPlayThrough={() => setLoader(false)}
            onError={() => setError(true)}
          >
            <source src={filepath} type={`audio/${fileType}`} />
            Your browser does not support the audio element.
          </audio>
          {renderDownloadButton()}
        </Stack>
      </Box>
    );
  }

  // 📝 Text
  if (SUPPORTED_TEXT_TYPES.includes(fileType)) {
    return (
      <Box position="relative" height={height}>
        {loader && renderLoader()}
        <iframe
          src={filepath}
          title="Text Viewer"
          width="100%"
          height="100%"
          style={{
            border: "1px solid #ddd",
            fontFamily: "monospace",
          }}
          onLoad={() => setLoader(false)}
        />
      </Box>
    );
  }

  // ❌ Unsupported
  return (
    <Stack
      spacing={2}
      alignItems="center"
      height={height}
      justifyContent="center"
      width={"100%"}
    >
      <Typography variant="h6">No preview available</Typography>
      {renderDownloadButton()}
    </Stack>
  );
}

export default FileViewer;
