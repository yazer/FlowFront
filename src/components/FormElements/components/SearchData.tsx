/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { getMethod } from "../../../apis/ApiMethod";
import { GET_DB_TABLES } from "../../../apis/urls";
import DataTable from "../../DataTable/dataTable";
import FormLabel from "./FormLabel";
import CheckBox from "./CheckBox";
import InputField from "./InputField";
import { useIntl } from "react-intl";

function filterArrayByAllKeysOptimized(data: any, searchTerm: string) {
  if (!searchTerm || !Array.isArray(data)) return data;

  const lowerSearch = searchTerm.toLowerCase();

  return data.filter((item) => {
    for (const key in item) {
      const val = item[key];
      if (val != null && typeof val !== "object") {
        if (String(val).toLowerCase().includes(lowerSearch)) {
          return true; // Early return for performance
        }
      }
    }
    return false;
  });
}

function SearchData({
  field,
  onSelect,
}: {
  field: any;
  onSelect?: (value: any) => void;
}) {
  const { locale } = useIntl();
  const [dataGrid, setDataGrid] = React.useState<any>({
    columns: [],
    row: [],
    filtered: [],
    selectedColumns: [],
  });
  const [selectedColumns, setSelectedColumns] = React.useState<any>([]);

  useEffect(() => {
    if (field.tableId) {
      (async () => {
        let data = dataGrid.row;
        if (!dataGrid.row.length) {
          data = await getMethod(
            `${GET_DB_TABLES}${
              field.tableId
            }/data/?columns=${field.columns.join(",")}`
          );
          defineGrid(data.data);
        } else {
          defineGrid(data);
        }
      })();
    }
  }, [selectedColumns?.length, dataGrid.row]);

  function defineGrid(data: any) {
    setDataGrid((state: any) => ({
      row: data,
      filtered: state.filtered || data,
      columns: [
        {
          key: "id",
          label: "Select",
          render: (_: any, row: any) => (
            <>
              <CheckBox
                label={""}
                onChange={function (e: any): void {
                  setSelectedColumns((state: any) => {
                    const selected = [...(state || [])];
                    if (e.target.checked) {
                      selected.push(row.row_id);
                    } else {
                      const index = selected.indexOf(row.row_id);
                      if (index > -1) {
                        selected.splice(index, 1);
                      }
                    }
                    onSelect?.(selected);
                    return selected;
                  });
                }}
                isChecked={selectedColumns?.includes(row.row_id)}
              />
            </>
          ),
        },
        ...Object.keys(data[0])?.map((dat) => ({
          key: dat,
          label: dat,
        })),
      ],
    }));
  }

  function filterRow(value: string) {
    if (value === "") {
      setDataGrid((prev: any) => ({ ...prev, filtered: [] }));
      filterSelectedRows();
      return;
    }
    const filteredData = filterArrayByAllKeysOptimized(dataGrid.row, value);
    setDataGrid((prev: any) => ({ ...prev, filtered: filteredData }));
  }

  function filterSelectedRows() {
    if (selectedColumns?.length) {
      const filteredData = dataGrid.row.filter((row: any) =>
        selectedColumns.includes(row.row_id)
      );
      setDataGrid((prev: any) => ({ ...prev, filtered: filteredData }));
    } else {
      setDataGrid((prev: any) => ({ ...prev, filtered: [] }));
    }
  }

  return (
    <>
      <InputField
        label={field?.translate?.[locale]?.label}
        id={""}
        onChange={function (
          value: string,
          e: React.ChangeEvent<HTMLInputElement>
        ): void {
          filterRow(value);
        }}
      />
      {dataGrid.filtered?.length ? (
        <DataTable
          data={dataGrid.filtered}
          columns={dataGrid.columns}
          loading={false}
          search={false}
          pagination={false}
          minHeight={0}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default SearchData;
