import { Box, Stack, Typography } from "@mui/material";
import React from "react";

function AiMessage({ message }: { message: string }) {
  return (
    <Box
      className="ai-message-item"
      height="fit-content"
      maxWidth="80%"
      width="fit-content"
    >
      <Typography variant="caption">{message}</Typography>
    </Box>
  );
}

export default AiMessage;
