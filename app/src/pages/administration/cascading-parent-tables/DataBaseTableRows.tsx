import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { getMethod, postMethod } from "../../../apis/ApiMethod";
import { DELETE_ROW_CSV, GET_DB_TABLES } from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import { FormattedMessage } from "react-intl";
import { IconButton, Checkbox, Button } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import useTranslation from "../../../hooks/useTranslation";
import { MdAdd, MdDelete } from "react-icons/md";
import CsvUploaderDialog from "./CsvUploaderDialog";
import UploadProgressProvider from "../../../components/uploadProgress/UploadProgressProvider";
import UploadToast from "../../../components/uploadProgress/UploadProgress";
import DeleteDialog from "../../../components/Dialog/DeleteDialog/DeleteDialog";
import toast from "react-hot-toast";
import { Loading } from "../../../components/Loading/Loading";

function DataBaseTableRows() {
  const [table, setTable] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page_size, setPageSize] = React.useState<number>(10);
  const [page_number, setPageNumber] = React.useState<number>(1);

  const [filteredList, setFilterList] = React.useState<any[]>([]);
  const [loader, setLoader] = React.useState(true);
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]);
  const { tableId } = useParams();
  const [columns, setColumns] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const { translate } = useTranslation();
  const [tableName, setTableName] = React.useState<string>("");
  const [appendDataDialogOpen, setAppendDataDialogOpen] =
    React.useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    fetchTableData();
  }, [tableId]);

  async function fetchTableData() {
    setLoader(true);
    try {
      const field = await getMethod(`${GET_DB_TABLES}${tableId}/columns/`);
      const columns = field.columns.map((item: any) => item.id);
      setTableName(field.table?.table_name || "Database Table");

      // Fetch data for the table
      const res = await getMethod(
        `${GET_DB_TABLES}${tableId}/data/?columns=${columns.join(",")}`
      );
      const dynamicColumns = field.columns.map((item: any) => ({
        key: item.id,
        label: <FormattedMessage id={item.column_name} />,
        render: (value: string, row: any) => (
          <div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {row[item.column_name] || value}
            </span>
          </div>
        ),
      }));

      setColumns([...dynamicColumns]);
      setTable(res.results || []);
      setTotalCount(res.count);
      setFilterList(res.results || []);
    } catch (err) {
      console.error("Error fetching table list:", err);
    } finally {
      setLoader(false);
    }
  }

  const columnsWithCheckbox = useMemo(() => {
    // ✅ Checkbox Column (MUI Checkbox)
    const checkboxColumn = {
      key: "select",
      label: (
        <Checkbox
          size="small"
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < filteredList.length
          }
          checked={
            filteredList.length > 0 &&
            selectedRows.length === filteredList.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              const allIds = filteredList.map((row) => row.row_id);
              setSelectedRows(allIds);
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      render: (_: any, row: any) => (
        <Checkbox
          size="small"
          checked={selectedRows.includes(row.row_id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows((prev) => [...prev, row.row_id]);
            } else {
              setSelectedRows((prev) => prev.filter((id) => id !== row.row_id));
            }
          }}
        />
      ),
    };
    return [checkboxColumn, ...columns];
  }, [selectedRows, columns, filteredList]);

  function handleSearchChange(search?: string) {
    if (!search) {
      setFilterList(table);
      return;
    }
    setFilterList(
      table?.filter((item) =>
        item.name?.toLowerCase().includes(search?.toLowerCase() || "")
      )
    );
  }

  async function deleteSelectedRows() {
    setLoading(true);
    setDeleteDialogOpen(false);
    try {
      await postMethod(DELETE_ROW_CSV, {
        row_ids: selectedRows,
      });
      toast.success(translate("deletedSuccessfully"));
      setSelectedRows([]);
      fetchTableData();
    } catch (error) {
      console.error("Error deleting rows:", error);
      toast.error(translate("errorDeleteRows"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <Loading open={loading} />
      <DeleteDialog
        open={deleteDialogOpen}
        handleClose={() => setDeleteDialogOpen(false)}
        text={
          <FormattedMessage
            id="deleteConfirmationMessage"
            values={{
              item: filteredList
                .filter((item) => selectedRows.includes(item.row_id))
                .map((item) => item["Lead Number"])
                .join(", "),
            }}
          />
        }
        handleSubmit={deleteSelectedRows}
      />
      <UploadProgressProvider>
        <UploadToast />
        {tableId && tableName ? (
          <CsvUploaderDialog
            open={appendDataDialogOpen}
            tableId={tableId}
            handleClose={() => setAppendDataDialogOpen(false)}
            tableName={tableName}
          />
        ) : null}
      </UploadProgressProvider>
      <DataTable
        columns={columnsWithCheckbox}
        data={filteredList}
        loading={loader}
        pagination={true}
        pageSize={page_size}
        pageNumber={page_number}
        totalCount={totalCount}
        onPageChange={(page: number) => setPageNumber(page)}
        onPageSizeChange={(pageSize: number) => setPageSize(pageSize)}
        extraComponent={
          <>
            <Button
              color="error"
              variant="outlined"
              disabled={!selectedRows.length}
              startIcon={<MdDelete />}
              disableElevation
              onClick={() => setDeleteDialogOpen(true)}
            >
              {translate("delete")}
            </Button>

            <Button
              variant="contained"
              startIcon={<MdAdd />}
              disabled={!!selectedRows.length}
              disableElevation
              onClick={() => setAppendDataDialogOpen(true)}
            >
              {translate("appendData")}
            </Button>
          </>
        }
        Title={
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-1">
              <IconButton size="small" onClick={() => navigate(-1)}>
                <IoArrowBack />
              </IconButton>
              <h1 className="text-2xl font-bold text-gray-900">{tableName}</h1>
            </div>
          </div>
        }
        search={true}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}

export default DataBaseTableRows;
