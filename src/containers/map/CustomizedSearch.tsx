/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import useDebounce from "../../hooks/useDebounce";
import { SlLocationPin } from "react-icons/sl";

import {
  Autocomplete,
  CircularProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

export default function CustomizedInputBase({
  onChange,
  onSearch,
  searchQuery,
  onSelected,
}: {
  onChange: (e: any) => any;
  onSearch: () => any;
  searchQuery: string;
  onSelected: (value: any) => any;
}) {
  const debounce = useDebounce(searchQuery);
  const [options, setOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    searchLocation();
  }, [debounce]);

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: "100%", padding: "10px" }}
          renderOption={(props, option: any) => (
            <Tooltip title={option.display_name} placement="left">
              <Stack component={"li"} direction={"row"} spacing={1} {...props}>
                <SlLocationPin color="#5e5e5e" />{" "}
                <Typography variant="h6" fontWeight={400}>
                  {option.display_name.split(",")[0]}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={400}
                  color="text.secondary"
                  flex={1}
                  noWrap
                >
                  {option.display_name.split(",").slice(1).join(", ")}
                </Typography>
              </Stack>
            </Tooltip>
          )}
          onChange={(e, value) => {
            if (value) {
              onSelected(value);
            }
          }}
          loading={loading}
          getOptionLabel={(option: any) => option.display_name}
          renderInput={(params) => (
            <TextField
              placeholder="Search for a place"
              {...params}
              sx={{
                border: "none",
                "& input": {
                  fontSize: "14px",
                },
              }}
              variant="standard"
              onChange={onChange}
              onClick={(e) => e.stopPropagation()}
              InputProps={{
                disableUnderline: true,
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={onSearch}
        >
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
          <DirectionsIcon />
        </IconButton>
      </Paper>
      {/* <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: "200px",
              width: "500px",
            },
          },
        }}
      >
        {options.length === 0 && <MenuItem>No results found</MenuItem>}
        {options.map((option: any) => (
          <MenuItem key={option.place_id} onClick={handleClose}>
            {option.display_name}
          </MenuItem>
        ))}
      </Menu> */}
    </>
  );
}
