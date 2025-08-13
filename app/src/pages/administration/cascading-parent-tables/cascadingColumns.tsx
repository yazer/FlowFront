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

import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchColumnValues } from "../../../apis/flowBuilder";
import { BsEye } from "react-icons/bs";
import DataTable from "../../../components/DataTable/dataTable";

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

const CascadingColumns = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<ObjType[]>([]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    fetchList(tableId);
  }, [tableId]);

  const fetchList = async (tableId: any, search?:string) => {
    try {
      const res = await fetchColumnValues(tableId, search);
      setDataList(res || []);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const handleSearchChange = (value: string) => {
    fetchList(tableId, value)
  }


  const columns = [
    {
      key: "value",
      label: <FormattedMessage id="value" />,
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={dataList && Array.isArray(dataList) ? dataList : []}
        loading={loader}
        Title={
          <div className="flex items-center justify-between pb-4">
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
                <FormattedMessage id="headingColumns"></FormattedMessage>
              </h1>
            </div>
          </div>
        }
        onSearchChange={handleSearchChange}
      ></DataTable>
    </div>
  );
};

export default CascadingColumns;
