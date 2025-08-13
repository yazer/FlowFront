import { RemoveRedEyeOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { fetchAdminProcessList } from "../../../apis/administration";
import Chip from "../../../components/Chip/Chip";
import DataTable from "../../../components/DataTable/dataTable";
import { formattedDate } from "../../../utils/constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchColumnList,
  fetchDependantTables,
  fetchTableList,
} from "../../../apis/flowBuilder";
import { BsEye } from "react-icons/bs";
import NoResults from "../../../components/NoResults";

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

const CascadingDependentTables = () => {
  const { tableId } = useParams();
  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  const [showVersions, setShowVersions] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchList(tableId);
  }, [tableId]);

  const fetchList = async (tableId: any) => {
    try {
      const res = await fetchDependantTables(tableId);
      setDataList(res.dependent_tables || []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="tableName" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.icon || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {value?.charAt(0)}
            </Avatar>
            <span className="text-sm font-medium text-gray-700 truncate">
              {value}
            </span>
          </div>
        );
      },
    },
    {
      key: "viewDependent",
      label: <FormattedMessage id="viewDependent" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/database/dependent-tables/" + row?.id}>
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
    {
      key: "viewColumns",
      label: <FormattedMessage id="viewColumns" />,
      render: (_: any, row: any) => (
        <Link to={"/administration/database/columns/" + row?.id}>
          <Button
            startIcon={<RemoveRedEyeOutlined />}
            className="rtl:gap-[10px]"
            sx={{ textTransform: "capitalize" }}
            onClick={() => setShowVersions(true)}
          >
            <FormattedMessage id="view" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            <FormattedMessage id="headingDependentTable"></FormattedMessage>
          </h1>
        </div>
      </div> */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center">
          <IconButton
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate(-1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <h1 className="text-2xl font-bold text-gray-900">
            <FormattedMessage id="headingDependentTable"></FormattedMessage>
          </h1>
        </div>
      </div>
      <Grid container spacing={2}>
        {!loader && (!Array.isArray(dataList) || dataList.length === 0) && (
          <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
            <NoResults></NoResults>
          </div>
        )}
        {loader ? (
          <div className="flex items-center justify-center w-full h-[calc(100vh_-_200px)]">
            <CircularProgress />
          </div>
        ) : (
          dataList &&
          Array.isArray(dataList) &&
          dataList?.map((item) => (
            <Grid item md={3} lg={3} xs={12}>
              <div className="w-full bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <div className="flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-400">
                        <FormattedMessage id="dependentTableName"></FormattedMessage>{" "}
                        :
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item?.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          ))
        )}
      </Grid>

      {/* <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
      ></DataTable> */}
    </div>
  );
};

export default CascadingDependentTables;
