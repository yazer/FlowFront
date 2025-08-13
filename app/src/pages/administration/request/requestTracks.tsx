import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router";
import { getMethod } from "../../../apis/ApiMethod";
import {
  GET_GROUPS,
  GET_GROUPS_USERS,
  REQUEST_TRACK,
} from "../../../apis/urls";
import DataTable from "../../../components/DataTable/dataTable";
import { useSorting } from "../../../hooks/useSorting";
import Chip from "../../../components/Chip/Chip";

const RequestTracks = () => {
  const { requestId } = useParams();

  const [details, setDetails] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [loader, setLoader] = useState(true);
  const { locale } = useIntl();
  const { sortQuery, ...sorting } = useSorting();

  //   const fetchGroupDetail = async () => {
  //     try {
  //       const res = await getMethod(REQUEST_TRACK + requestId);
  //       setTotalCount(res?.count ?? 0);
  //       setDetails(res || {});
  //       setLoader(false);
  //     } catch (err) {
  //       setLoader(false);
  //     }
  //   };

  const fetchList = async (
    pageSize: number,
    pageNumber: number,
    search?: string
  ) => {
    const url = new URL(REQUEST_TRACK + requestId);

    const params = new URLSearchParams({
      page: pageNumber.toString(),
      page_size: pageSize.toString(),
      search: search ?? "",
      lang: search ? localStorage.getItem("locale") ?? "" : "",
      ...sorting.sorting,
    });
    url.search = params.toString();

    try {
      const res = await getMethod(url);
      setData(res || []);
      setLoader(false);
    } catch (err) {
      console.error("Error fetching process versions:", err);
      setLoader(false);
    }
  };

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    fetchList(page, pageSize);
  };

  const handlePageSizeChange = (size: number) => {
    fetchList(1, size);

    setPageSize(size);
    setPageNumber(1); // Reset to the first page when page size changes
  };

  const handleSearchChange = (value: string) => {
    setPageNumber(1);
    setPageSize(10);
    fetchList(1, 10, value);
  };

  useEffect(() => {
    // fetchGroupDetail();
  }, []);

  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="adminThName" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row?.user_icon || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {row?.translation?.[locale]?.user?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 truncate">
                {row?.translation?.[locale]?.user}
              </span>
              {row?.is_active ? (
                <span className="text-xs text-green-600 font-semibold">
                  Active
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "stage",
      label: <FormattedMessage id="stage" />,
      render: (value: any, row: any) => {
        return <Chip value={row?.translation?.[locale]?.stage} type={"info"} />;
      },
    },
    {
      key: "estimated_date",
      label: <FormattedMessage id="estimatedDate" />,
      render: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-gray-700">
            {value ?? <FormattedMessage id="notSpecified"></FormattedMessage>}
          </span>
        );
      },
    },
    {
      key: "created_at",
      label: <FormattedMessage id="adminThCreatedDate" />,
      render: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-gray-700">{value}</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={data?.track && Array.isArray(data.track) ? data.track : []}
        loading={loader}
        pagination={true}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        {...sorting}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearchChange={handleSearchChange}
        Title={
          <div className="flex items-center justify-between pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <FormattedMessage id="requestTracks"></FormattedMessage> -{" "}
                <span className="text-primary">{data?.request_id}</span>
              </h1>
            </div>
          </div>
        }
      ></DataTable>
    </div>
  );
};

export default RequestTracks;
