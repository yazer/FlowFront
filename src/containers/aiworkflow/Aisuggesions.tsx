import { Box, Button, Typography } from "@mui/material";
import React from "react";

function Aisuggesions({ message }: { message: string }) {
  return (
    <Box
      className="ai-message-item-suggestion"
      maxWidth="80%"
      sx={{
        bgcolor: "prinary",
      }}
    >
      <Typography variant="caption" color="primary">
        {message}
      </Typography>
    </Box>
  );
}

export default Aisuggesions;
