import * as React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";

export default function TextToggleGroup({
  itemStyle,
  changeItemStyle,
  disabled = false,
}: {
  itemStyle: {
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    lineThrough?: boolean;
  };
  changeItemStyle: (
    event: React.MouseEvent<HTMLElement>,
    newValue: string[]
  ) => void;
  disabled?: boolean;
}) {
  return (
    <ToggleButtonGroup
      data-ignore-deselect
      value={Object.entries(itemStyle)
        .filter(([, value]) => value)
        .map(([key]) => key)}
      onChange={changeItemStyle}
      size="small"
      aria-label="text formatting"
    >
      <ToggleButton
        style={{
          border: "none",
        }}
        value="bold"
        aria-label="bold"
        disabled={disabled}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        style={{
          border: "none",
        }}
        value="italic"
        aria-label="italic"
        disabled={disabled}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        style={{
          border: "none",
        }}
        value="underlined"
        aria-label="underlined"
        disabled={disabled}
      >
        <FormatUnderlinedIcon />
      </ToggleButton>
      <ToggleButton
        style={{
          border: "none",
        }}
        value="lineThrough"
        aria-label="lineThrough"
        disabled={disabled}
      >
        <FormatStrikethroughIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
