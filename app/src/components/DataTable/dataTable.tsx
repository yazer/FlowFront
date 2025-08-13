import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import NoResults from "../NoResults";
import { HiDownload } from "react-icons/hi";
import toast from "react-hot-toast";

const DataTable = ({
  columns,
  data,
  loading = true,
  pagination = false,
  pageSize = 10,
  pageNumber = 1,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  search = true,
  onSearchChange,
  searchPlaceholder = "Search...",
  Title = <></>,
  extraComponent = <></>,
  filterComponent = <></>,
  id = (row: any) => row.uuid,
  minHeight = "400px",
  onHandleSort = () => {},
  sorting = { sort: "", direction: "asc" },
  isExport = false,
  exportURL,
  disabled = () => false,
}: {
  columns: any[];
  data: any[];
  loading: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: any) => void;
  search?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  searchPlaceholder?: string;
  Title?: any;
  extraComponent?: any;
  filterComponent?: any;
  id?: any;
  minHeight?: string | number;
  onHandleSort?: (sortedCol: string, direction: "asc" | "desc") => void;
  sorting?: {
    sort: string;
    direction: "asc" | "desc";
  };
  disabled?: (row: any) => boolean;
  isExport?: boolean;
  exportURL?: string;
}) => {
  const { locale } = useIntl();
  const [searchTerm, setSearchTerm] = useState("");

  const visibleColumns = columns.filter((col) => !col.hidden);

  const translated = (data: any, key: string) => {
    return data.translations?.[locale]?.[key] || data[key];
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (event: any) => {
    const newSize = event.target.value as number;
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange && onSearchChange(e.target.value);
  };

  return (
    <div
      className="w-full shadow-md rounded-lg border relative"
      style={{ minHeight: minHeight }}
    >
      {/* Search Field */}
      <div className="p-4 flex flex-col gap-2 border-b">
        <div className="flex justify-between items-center">
          {Title}
          <div className="flex items-center gap-2">
            {search && (
              <TextField
                placeholder={searchPlaceholder}
                size="small"
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {isExport && <ExportDropdown api={exportURL} />}
            {extraComponent}
          </div>
        </div>
        {filterComponent}
      </div>

      <div className="overflow-x-auto">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 250px)" }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 260px)",
              }}
            >
              <CircularProgress sx={{ height: "10px", width: "10px" }} />
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-40">
                  <tr>
                    {visibleColumns.map((col) => (
                      <th
                        key={col.key}
                        className="px-6 py-3 text-left rtl:text-right"
                        onClick={() =>
                          onHandleSort &&
                          onHandleSort(
                            col.key,
                            sorting.sort === col.key
                              ? sorting.direction === "asc"
                                ? "desc"
                                : "asc"
                              : "asc"
                          )
                        }
                      >
                        <span className="cursor-pointer flex items-center gap-2">
                          {col.label}{" "}
                          <span className="text-gray-400 text-xs">
                            {col.key === sorting.sort &&
                              (sorting.direction === "asc" ? (
                                <FaSortAmountDownAlt />
                              ) : (
                                <FaSortAmountUpAlt />
                              ))}
                          </span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!loading && (!Array.isArray(data) || data.length === 0) ? (
                    <tr>
                      <td
                        colSpan={visibleColumns.length}
                        className="h-[calc(100vh_-_260px)]"
                      >
                        <NoResults />
                      </td>
                    </tr>
                  ) : (
                    data?.map((row, index) => (
                      <tr
                        key={id(row) || row.uuid || index}
                        className={`bg-white border-b hover:bg-gray-50 ${
                          disabled(row) ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {visibleColumns.map((col) => (
                          <td
                            key={col.key}
                            className="px-6 py-3 text-left rtl:text-right"
                          >
                            {col.render
                              ? col.render(row[col.key], row)
                              : translated(row, col.key)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      {pagination && totalCount > 10 && (
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
          <FormControl variant="outlined" size="small">
            <InputLabel>Items per page</InputLabel>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              label="Items per page"
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
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
      )}
    </div>
  );
};

export default DataTable;

function ExportDropdown({ api }: { api?: string }) {
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleExport = async (type: "pdf" | "csv") => {
    const token = localStorage.getItem("token");
    setOpen(false);

    try {
      const response = await fetch(`${api}?export=${type}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw errorText || response.statusText;
      }

      const blob = await response.blob();
      const fileName = `export.${type}`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error((error as string) || "Export failed");
      console.error("Export failed:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        disableElevation
        endIcon={<HiDownload />}
        onClick={() => setOpen(!open)}
        variant="contained"
        disabled={loader}
      >
        <FormattedMessage id="export"></FormattedMessage>
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => handleExport("pdf")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            <FormattedMessage id="exportAsPDF"></FormattedMessage>
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            <FormattedMessage id="exportAsCSV"></FormattedMessage>
          </button>
        </div>
      )}
    </div>
  );
}
