import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { getMethod } from "../../../apis/ApiMethod";
import { GET_DB_TABLES } from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import TabMenuNew from "../../../components/TabMenu/TabMenuNew";

const columns = [
  {
    key: "table_name",
    label: <FormattedMessage id="tableName" />,
    render: (value: string, row: any) => {
      return (
        <div>
          <span className="text-sm font-medium text-gray-700 truncate">
            {value}
          </span>
        </div>
      );
    },
  },
  {
    key: "viewColumns",
    label: <FormattedMessage id="viewValues" />,
    render: (_: any, row: any) => {
      return (
        <Link to={"/administration/parent-tables/database/" + row?.id?.toString()}>
          <Button
            startIcon={<RemoveRedEyeOutlined />}
            className="rtl:gap-[10px]"
            sx={{ textTransform: "capitalize" }}
          >
            <FormattedMessage id="view" />
          </Button>
        </Link>
      );
    },
  },
];

function DataBaseTable() {
  const [table, setTable] = React.useState<any[]>([]);
  const [filteredList, setFilterList] = React.useState<any>([]);
  const [loader, setLoader] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoader(true);
      try {
        const res = await getMethod(GET_DB_TABLES);
        setTable(res.tables || []);
        setFilterList(res.tables || []);
      } catch (err) {
        console.error("Error fetching table list:", err);
      } finally {
        setLoader(false);
      }
    })();
  }, []);

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

  console.log(filteredList)

  return (
    <div className="space-y-4 p-4">
      <TabMenuNew
        handleChange={(tab) => {
          if (tab === "lookup") {
            navigate("..", { relative: "path" });
          }
        }}
        tabs={["lookup", "database"]}
        selected={"database"}
      />
      <DataTable
        columns={columns}
        data={filteredList}
        loading={loader}
        Title={
          <div className="flex items-center justify-between pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <FormattedMessage id="databaseTableHeading"></FormattedMessage>
              </h1>
            </div>
          </div>
        }
        search={true}
        onSearchChange={handleSearchChange}
        extraComponent={<></>}
      />
    </div>
  );
}

export default DataBaseTable;
