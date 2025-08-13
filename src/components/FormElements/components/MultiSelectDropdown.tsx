import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import FormLabel from "./FormLabel";

interface MultiSelectProps {
  name: string;
  label?: string | React.ReactNode;
  options: any[];
  onChange?: any;
  value?: any[];
  defaultValue?: Array<string>; // Array of selected values
  menuHeight?: string; // Height of the menu
  labelKey?: string;
  valueKey?: string;
}

const CustomSelect = styled(Select)(({ theme }: any) => ({
  background: "#ffffff",
  boxShadow:
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  appearance: "none",
  "& fieldset": { border: "1px solid #e5e7eb" },
}));

const MultiSelectField: React.FC<MultiSelectProps> = ({
  name,
  label,
  options,
  onChange,
  value = [],
  defaultValue = [],
  menuHeight = "100%",
  labelKey = "label",
  valueKey = "value",
}) => {
  return (
    <FormControl fullWidth>
      {label && <FormLabel label={label} />}
      <CustomSelect
        labelId={`${name}-label`}
        id={name}
        multiple
        onChange={onChange}
        value={value} // Controlled vs uncontrolled
        defaultValue={[]}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: menuHeight,
            },
            "& .MuiMenuItem-root": {
              height: "30px",
            },
          },
        }}
        // value={value}
        // onChange={handleChange}
        sx={{
          "&:focus": {
            outline: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5e7eb", // Change the border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5e7eb", // Remove the blue border for outlined variant
          },

          height: "39px",
          // minHeight:customHeight,
          borderRadius: "0.25rem",
          "& .MuiInputBase-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "input::placeholder": {
            fontSize: "12px",
          },
          "textarea::placeholder": {
            fontSize: "12px",
          },
        }}
        displayEmpty={true}
        renderValue={(selected: any) => {
          if (!selected || selected.length === 0) {
            return (
              <Typography color="textSecondary">Pls select options</Typography>
            );
          }

          const maxVisibleChips = 3; // limit number of chips shown
          const selectedChips = selected.slice(0, maxVisibleChips);
          const extraCount = selected.length - maxVisibleChips;

          return (
            <Tooltip
              title={selected
                .map(
                  (val: any) =>
                    options.find((opt) => opt[valueKey] === val)?.[labelKey]
                )
                .join(", ")}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  overflow: "hidden",
                  gap: 0.5,
                }}
              >
                {selectedChips.map((val: any) => {
                  const selectedOption = options.find(
                    (opt) => opt[valueKey] === val
                  );
                  return selectedOption ? (
                    <Chip
                      key={val}
                      label={selectedOption[labelKey]}
                      sx={{
                        borderRadius: "0.50rem",
                        maxWidth: "100px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                  ) : null;
                })}
                {extraCount > 0 && (
                  <Chip
                    label={`+${extraCount} more`}
                    sx={{ borderRadius: "0.50rem" }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option?.[labelKey]} value={option?.[valueKey]}>
            <Checkbox
              checked={
                Array.isArray(value) && value.includes(option?.[valueKey])
              }
              size="small"
            />
            <ListItemText
              primary={
                <Typography variant="caption">{option?.[labelKey]}</Typography>
              }
            />
          </MenuItem>
        ))}
      </CustomSelect>
    </FormControl>
  );
};

export default MultiSelectField;
