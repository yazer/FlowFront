import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router";
import {
  fetchProcessDetails,
  fetchProcessVersions,
} from "../../../apis/process";
import DataTable from "../../../components/DataTable/dataTable";
import { formattedDate } from "../../../utils/constants";
import { useSorting } from "../../../hooks/useSorting";

const ProcessVersionDetails = () => {
  const { processId } = useParams();

  const [processDetails, setProcessDetails] = useState<any>({});
  const [versionList, setVersionList] = useState([]);
  const [loader, setLoader] = useState(true);
  const { locale } = useIntl();
  const { sortQuery, ...sorting } = useSorting();

  const fetchProcess = async () => {
    try {
      const res = await fetchProcessDetails(processId);
      setTotalCount(res?.count ?? 0);
      setProcessDetails(res || {});
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const fetchList = async (
    pageSize: number,
    pageNumber: number,
    search?: string
  ) => {
    try {
      const res = await fetchProcessVersions(
        processId,
        pageSize,
        pageNumber,
        search,
        sorting.sorting
      );

      setTotalCount(res?.count ?? 0);
      setVersionList(res || []);
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
    fetchProcess();
  }, []);
  useEffect(() => {
    fetchList(pageNumber, pageSize);
  }, [sorting.sorting]);

  const columns = [
    {
      key: "name",
      label: <FormattedMessage id="adminThVersion" />,
      render: (value: string, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.icon_url || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {row.translations[locale]?.name?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 truncate">
                {row.translations[locale]?.name}
              </span>
              {row.is_active ? (
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
      key: "published_by",
      label: <FormattedMessage id="publishedBy" />,
      render: (value: any, row: any) => {
        return (
          <span className="text-sm font-medium text-gray-700">
            {row.translations?.[locale]?.published_by}
          </span>
        );
      },
    },
    {
      key: "published_ts",
      label: <FormattedMessage id="published" />,
      render: (value: any) => formattedDate(value),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <DataTable
        columns={columns}
        data={versionList && Array.isArray(versionList) ? versionList : []}
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
                <FormattedMessage id="versions"></FormattedMessage> -{" "}
                <span className="text-primary">{processDetails?.name}</span>
              </h1>
            </div>
          </div>
        }
      ></DataTable>
    </div>
  );
};

export default ProcessVersionDetails;
