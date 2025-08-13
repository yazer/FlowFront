/* eslint-disable react-hooks/exhaustive-deps */
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { fetchTableList } from "../../../apis/flowBuilder";
import DataTable from "../../../components/DataTable/dataTable";
import TabMenuNew from "../../../components/TabMenu/TabMenuNew";
import UploadToast from "../../../components/uploadProgress/UploadProgress";
import { useSorting } from "../../../hooks/useSorting";
import useTranslation from "../../../hooks/useTranslation";
import CsvUploaderDialog from "./CsvUploaderDialog";

type ObjType = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  remarks: string;
  icon: string | null;
  is_active: boolean;
  on_confirmation: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  category: number;
};

const CascadingParentTable = () => {
  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [openCsvUpload, setOpenCsvUpload] = useState(false);
  const { translate } = useTranslation();
  const { sortQuery, ...sorting } = useSorting();

  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [sorting.sorting]);

  const fetchList = async (search?: string) => {
    try {
      const res = await fetchTableList(search, sorting.sorting);
      setDataList(res || []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const handleSearchChange = (value: string) => {
    fetchList(value);
  };

  const columns = [
    {
      key: "name",
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
      key: "type",
      label: <FormattedMessage id="type" />,
    },
    {
      key: "viewColumns",
      label: <FormattedMessage id="viewValues" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/database/column-values/" + row?.id}>
          <Button
            startIcon={<RemoveRedEyeOutlined />}
            className="rtl:gap-[10px]"
            sx={{ textTransform: "capitalize" }}
          >
            <FormattedMessage id="view" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-4">
      <UploadToast />

      <TabMenuNew
        handleChange={(tab) => tab === "DataBase" && navigate("database")}
        tabs={["Look Up", "DataBase"]}
        selected={"Look Up"}
      />

      <div className="space-y-4 mt-4">
        <CsvUploaderDialog
          open={openCsvUpload}
          handleClose={() => setOpenCsvUpload(false)}
        />
        <DataTable
          {...sorting}
          columns={columns}
          data={dataList && Array.isArray(dataList) ? dataList : []}
          loading={loader}
          Title={
            <div className="flex items-center justify-between pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <FormattedMessage id="headingTable"></FormattedMessage>
                </h1>
              </div>
            </div>
          }
          search={true}
          onSearchChange={handleSearchChange}
          extraComponent={
            <>
              <Button
                size="small"
                variant="contained"
                disableElevation
                onClick={() => setOpenCsvUpload(true)}
              >
                {translate("uploadCSV")}
              </Button>
              <Button size="small" variant="contained" disableElevation>
                {translate("uploadManualData")}
              </Button>
            </>
          }
        />
      </div>
    </div>
  );
};

export default CascadingParentTable;
