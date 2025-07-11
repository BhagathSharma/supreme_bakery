"use client";

import { CircularProgress, Typography, Box, Backdrop } from "@mui/material";

export default function FullPageLoader() {
  return (
    <Backdrop
      open
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Loading, please wait...
        </Typography>
      </Box>
    </Backdrop>
  );
}
