import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import React from "react";

function CustomPagination({
  pageSize = 10,
  pageNumber = 1,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
}: {
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: any) => void;
}) {
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (onPageChange) {
      onPageChange(page); // Notify the parent component about the page change
    }
  };

  const handlePageSizeChange = (event: any) => {
    const newSize = event.target.value as number;
    if (onPageSizeChange) {
      onPageSizeChange(newSize); // Notify the parent component about the page size change
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="flex justify-between items-center mt-4 p-4">
      <FormControl variant="outlined" size="small">
        <InputLabel>Items per page</InputLabel>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          label="Items per page"
        >
          <MenuItem value={10}>12</MenuItem>
          <MenuItem value={20}>24</MenuItem>
          <MenuItem value={50}>48</MenuItem>
          <MenuItem value={100}>96</MenuItem>
        </Select>
      </FormControl>
      <Pagination
        dir="ltr"
        count={totalPages}
        page={pageNumber}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
      />
    </div>
  );
}

export default CustomPagination;
