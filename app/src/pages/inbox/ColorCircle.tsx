import { Box, ButtonBase, useTheme } from "@mui/material";

function ColorCircle({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      padding={0.5}
      borderRadius={1}
      bgcolor={selected ? "action.selected" : "transparent"}
      border={selected ? `1px solid #d3d3d3` : "none"}
    >
      <ButtonBase
        sx={{
          background: color,
          opacity: "0.6",
          height: 30,
          width: 30,
          borderRadius: "50%",
        }}
        onClick={onClick}
      ></ButtonBase>
    </Box>
  );
}

export default ColorCircle;
