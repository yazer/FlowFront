/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getMethod } from "../../../apis/ApiMethod";
import {
  GET_COLUMNS_META_DATA,
  GET_DB_TABLES,
  GET_FILTER_DATA,
} from "../../../apis/urls";

import DataTable from "../../DataTable/dataTable";
import FormLabel from "./FormLabel";
import Chip from "../../Chip/Chip";
import { InfoOutlined } from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Dropdown from "../../Dropdown/Dropdown";
import InputField from "./InputField";

function DataGrid({
  field,
  isPreview,
  handleChange,
  search,
}: {
  field: any;
  isPreview?: boolean;
  handleChange?: any;
  search?: any;
}) {
  console.log(field);
  const { locale } = useIntl();
  const [dataGrid, setDataGrid] = React.useState<any>({ columns: [], row: [] });
  const [page_size, setPageSize] = React.useState<number>(field.noOfRows || 10);
  const [page_number, setPageNumber] = React.useState<number>(1);
  const [actionColName, setActionColName] = React.useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState({});
  const [filterConfig, setFilterConfig] = useState({});

  const [columnValuesUpdate, setColumnValueToUpdate] = useState<any>({});

  const [tableStatus, setTableStatus] = useState<any>({});

  console.log(dataGrid);

  // let { tableStatus, setTableStatus } = tableContext as {
  //   tableStatus: HomeContextType;
  //   setTableStatus: React.Dispatch<React.SetStateAction<HomeContextType>>;
  // };

  useEffect(() => {
    const array = [...field.columns, field.columnToUpdate];
    const uniqueArray = array.filter(
      (item, index) => array.indexOf(item) === index
    );

    const rows =
      field?.showOnlyUpdatedRecords && field?.updated_row_list?.length > 0
        ? field.updated_row_list
        : null;

    let url = `${GET_DB_TABLES}${
      field.tableId
    }/data/?columns=${uniqueArray.join(
      ","
    )}&page=${page_number}&page_size=${page_size}`;

    if (rows) {
      url += `&rows=${rows.join(",")}`;
    }

    (async () => {
      const data = await getMethod(url);

      const columns_list = await getMethod(
        `${GET_DB_TABLES}${field.tableId}/columns/`
      );

      setDataGrid({
        row: data?.results,
        columns: getColumns(
          field,
          columnValuesUpdate,
          columns_list,
          setActionColName,
          handleStatusChange,
          tableStatus,
          isPreview
        ),
        totalCount: data?.count,
      });
    })();
  }, [
    field.tableId,
    field.columns,
    tableStatus,
    columnValuesUpdate,
    field.columnToUpdate,
  ]);

  const getFilterOptions = async () => {
    for (let item of field?.filterColumns) {
      try {
        const res = await getMethod(GET_FILTER_DATA + item);
        setFilterConfig((prev: any) => ({ ...prev, [item]: res }));
      } catch (error) {}
    }
  };

  const getColumnValues = async () => {
    try {
      const res = await getMethod(GET_FILTER_DATA + field.columnToUpdate);

      // setColumnValueToUpdate(res?.values?.filter((i: any) => !!i));
    } catch (error) {}
  };

  const getColumnMetaData = async () => {
    try {
      const res = await getMethod(
        GET_COLUMNS_META_DATA + field.columnToUpdate + "/metadata/"
      );

      setColumnValueToUpdate(res);
    } catch (error) {}
  };
  useEffect(() => {
    if (field.columnToUpdate) {
      getColumnValues();
      getColumnMetaData();
    }
  }, [field.columnToUpdate]);
  useEffect(() => {
    if (field?.filterColumns?.length > 0) {
      getFilterOptions();
    }
  }, [field.filterColumns]);

  async function handleStatusChange(value: any, rowData: any, column: any) {
    let updatedValue = {
      ...tableStatus,
      [rowData.row_id]: {
        column_id: column.id,
        value: value,
        row_id: rowData.row_id,
      },
    };

    let updatedValueSingle = {
      [rowData.row_id]: {
        column_id: column.id,
        value: value,
        row_id: rowData.row_id,
      },
    };

    let Val = field?.allowMultipleUpdates ? updatedValue : updatedValueSingle;

    setTableStatus?.(Val);
    handleChange(Val);
  }

  // const tableRow = useMemo(() => {
  //   if (selectedTab === "All") {
  //     return dataGrid.row;
  //   } else if (selectedTab === "Completed") {
  //     return dataGrid.row.filter((row: any) => row[actionColName] === "true");
  //   } else if (selectedTab === "Pending") {
  //     return dataGrid.row.filter(
  //       (row: any) => row[actionColName] === "false" || !row[actionColName]
  //     );
  //   }
  //   return [];
  // }, [selectedTab, dataGrid.row, actionColName]);

  return (
    <div style={{ width: "100%" }}>
      {/* <FormLabel label={field?.translate?.[locale]?.label} /> */}

      {(!isPreview || field?.is_show_info_preview) && (
        <Alert severity="info" style={{ marginBottom: "8px" }}>
          <Tooltip title={field?.info_message} placement="top" arrow>
            <Typography
              variant="body2"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block", // needed for ellipsis
                maxWidth: "100%", // ensures it fits inside the Alert
                cursor: "pointer",
              }}
            >
              {field?.info_message ? (
                field?.info_message
              ) : field?.is_update_required ? (
                <FormattedMessage id="requiredDataGridMsg"></FormattedMessage>
              ) : (
                <FormattedMessage id="defaultDataGridMsg" />
              )}
            </Typography>
          </Tooltip>
        </Alert>
      )}
      <DataTable
        Title={<div>{field?.translate?.[locale]?.label}</div>}
        search={search !== undefined ? search : field?.search}
        columns={dataGrid.columns}
        data={dataGrid?.row ?? []}
        disabled={(row: any) => row[actionColName] === "true"}
        loading={false}
        minHeight={0}
        pagination={true}
        pageSize={page_size}
        pageNumber={page_number}
        id={(row: any) => row.row_id}
        filterComponent={
          field.filter ? (
            <div className="flex-1">
              <FilterComponent
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                filterConfig={filterConfig}
                field={field}
              />
            </div>
          ) : undefined
        }
        totalCount={dataGrid.totalCount || dataGrid.row.length}
        onPageChange={(page: number) => setPageNumber(page)}
        onPageSizeChange={(pageSize: number) => setPageSize(pageSize)}
      />
    </div>
  );
}

export default DataGrid;

const FilterComponent = ({
  selectedFilter,
  setSelectedFilter,
  filterConfig,
  field,
}: {
  selectedFilter: any;
  setSelectedFilter: any;
  filterConfig: any;
  field: any;
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  const clearFilters = () => {};

  const handleChangeFilter = (column_id: any, value: any) => {
    // const columnName = filterConfig?.[column_id]?.column;
    setSelectedFilter({ ...selectedFilter, [column_id]: value });
  };

  const handleFilterDelete = (column_id: any) => {
    setSelectedFilter({ ...selectedFilter, [column_id]: null });
  };
  return (
    <div className="w-full">
      <div
        className={`bg-white rounded-lg shadow-md px-4 ${
          openFilter ? "py-2" : "py-1"
        } w-full`}
      >
        <div>
          <div className="flex items-center justify-end gap-4 ">
            <div className="flex items-center justify-end w-full gap-5">
              <>
                {!Object.values(selectedFilter).every((v) => !v) ? (
                  <Stack flex={1} direction="row" gap={1}>
                    <Typography variant="subtitle1">Filters : </Typography>
                    {Object.entries(selectedFilter).map(([key, value]) =>
                      value ? (
                        <Chip
                          key={key}
                          value={value}
                          type="grey"
                          isDelete={true}
                          onDelete={() => handleFilterDelete(key)}
                        />
                      ) : null
                    )}
                  </Stack>
                ) : (
                  <div className="flex-1 flex align-center gap-1 text-gray-400">
                    <InfoOutlined className="h-5 w-5" /> Empty Filters
                  </div>
                )}
              </>
              <IconButton
                size="small"
                onClick={() => setOpenFilter(!openFilter)}
              >
                {openFilter ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </div>
          </div>

          <Collapse orientation="vertical" in={openFilter}>
            <div className="flex items-end gap-4 mt-3">
              {/* <Grid container spacing={2}> */}

              <div
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "8px",
                }}
              >
                {field?.filterColumns?.map((item: any) => (
                  // <Grid item md={6} lg={4} xl={4} sm={12} xs={12}>
                  <Dropdown
                    key={item}
                    label={
                      filterConfig?.[item]?.column ?? (
                        <FormattedMessage id="filter"></FormattedMessage>
                      )
                    }
                    options={
                      filterConfig?.[item]?.values
                        ?.filter((i: any) => !!i)
                        ?.map((x: any) => ({
                          value: x,
                          label: x,
                        })) ?? []
                    }
                    value={selectedFilter?.[item] ?? ""}
                    name=""
                    onChange={(e: any) =>
                      handleChangeFilter(item, e.target.value)
                    }
                  />
                  // </Grid>
                ))}
              </div>

              <div className="h-[66px] flex items-end w-[140px]">
                <button
                  type="button"
                  onClick={clearFilters}
                  className={
                    "w-full px-4 py-2 rounded-md text-sm font-medium border transition bg-primary text-white border-blue-600"
                  }
                >
                  <FormattedMessage id={"clearFilter"} />
                </button>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

const getColumns = (
  field: any,
  columnValuesUpdate: any,
  columns_list: any,
  setActionColName: any,
  handleStatusChange: any,
  tableStatus: any,
  isPreview: any
) => {
  let columns = field.columns
    ?.filter((x: any) => x != field?.columnToUpdate)
    ?.map((dat: any) => {
      const column = columns_list.columns?.find((col: any) => col.id == dat);
      return {
        key: column?.column_name || dat,
        label: column?.column_name || dat,
      };
    });

  if (field?.columnToUpdate) {
    const column = columns_list?.columns?.find(
      (col: any) => col.id == field.columnToUpdate
    );

    setActionColName(column?.column_name || "");
    columns.push({
      key: column?.column_name,
      label: column?.column_name,
      render: (_rowData: any, row: any) => {
        console.log(row);
        return (
          <>
            {columnValuesUpdate?.is_choice_field ? (
              <Select
                disabled={isPreview || columnValuesUpdate?.allow_update}
                defaultValue={columnValuesUpdate?.choice_default_value ?? ""}
                value={
                  // @ts-ignore

                  tableStatus?.[row.row_id]?.value
                    ? tableStatus?.[row.row_id]?.value
                    : row?.[column?.column_name]?.value
                    ? row?.[column?.column_name]?.value
                    : columnValuesUpdate?.choice_default_value
                }
                size="small"
                onChange={(event) =>
                  handleStatusChange(event.target.value, row, column)
                }
              >
                {Array.isArray(columnValuesUpdate?.choice_field_options) &&
                  columnValuesUpdate?.choice_field_options?.map((item: any) => (
                    <MenuItem
                      value={item}
                      // sx={{ color: (theme) => theme.palette.success.main }}
                    >
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            ) : (
              <InputField
                id="column_update"
                label={""}
                value={
                  tableStatus?.[row.row_id]?.value
                    ? tableStatus?.[row.row_id]?.value
                    : columnValuesUpdate?.choice_default_value
                }
                onChange={(event) => handleStatusChange(event, row, column)}
                disabled={isPreview || columnValuesUpdate?.allow_update}
              />
            )}
          </>
        );
      },
    });
  }

  return columns;
};
