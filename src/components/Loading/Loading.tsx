import { Backdrop, CircularProgress } from "@mui/material";

export function Loading({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
