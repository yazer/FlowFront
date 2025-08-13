import { Typography } from "@mui/material";

function FormLabel({
  label,
  gutterBottom = true,
}: {
  label: string | React.ReactNode;
  gutterBottom?: boolean;
}) {
  return (
    <Typography
      variant="subtitle1"
      textTransform={"capitalize"}
      gutterBottom={gutterBottom}
    >
      {label}
    </Typography>
  );
}

export default FormLabel;
