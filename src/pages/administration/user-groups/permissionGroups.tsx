import React, { useEffect, useState } from "react";
import CheckBox from "../../../components/FormElements/components/CheckBox";
import DataTable from "../../../components/DataTable/dataTable";
import { FormattedMessage, useIntl } from "react-intl";
import { BsPlus } from "react-icons/bs";
import { getMethod, postMethod } from "../../../apis/ApiMethod";
import {
  ADD_PERMISSIONS,
  GET_GROUP_PERMISSIONS,
  GET_PERMISSIONS,
  REMOVE_PERMISSIONS,
} from "../../../apis/urls";
import { useParams } from "react-router";
import { returnErrorToast } from "../../../utils/returnApiError";
import { ScreenNames } from "../../../utils/permissions";

type PermissionType = "read" | "write" | "update" | "delete";

type PermissionObjType = {
  read: boolean;
  write: boolean;
  update: boolean;
  delete: boolean;
};

type PermissionListType = {
  page_key: string;
  page_name: string;
  permissions: PermissionObjType;
};

let permissionInitialValue = {
  read: false,
  write: false,
  update: false,
  delete: false,
};

const PermissionScreen = () => {
  const [dataSource, setDataSource] = useState<PermissionListType[]>([]);
  const [groupName, setGroupName] = useState<any>({});
  const { locale } = useIntl();
  const [updateLoader, setUpdateLoader] = useState("");
  const { groupId } = useParams();

  const togglePermission = async (
    page_key: string,
    permission_key: PermissionType,
    value: boolean
  ) => {
    setUpdateLoader(page_key + permission_key);
    const payload = {
      page_key: page_key,
      permission_type: permission_key,
      group_id: groupId,
    };

    const res = await postMethod(
      value ? REMOVE_PERMISSIONS : ADD_PERMISSIONS,
      payload
    );

    setDataSource((prev) =>
      prev.map((item) =>
        item.page_key === page_key
          ? {
              ...item,
              permissions: {
                ...item.permissions,
                [permission_key]: !item?.permissions[permission_key],
              },
            }
          : item
      )
    );
    try {
    } catch (error) {
      returnErrorToast({ error, locale });
    } finally {
      setUpdateLoader("");
    }
  };

  // const togglePermission = (recordKey: string, permType: PermissionType) => {};

  const fetchPermissionData = async () => {
    try {
      const res = await getMethod(GET_GROUP_PERMISSIONS);

      let permissionObject = res.find(
        (item: any) => item?.group_id === Number(groupId)
      );
      console.log(permissionObject);

      setDataSource(permissionObject?.pages);
      setGroupName(permissionObject?.translations);
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  useEffect(() => {
    fetchPermissionData();
  }, []);

  const columns = [
    {
      label: <FormattedMessage id="module"></FormattedMessage>,
      key: "page_name",
      // render: (value: any, record: any) => {
      //   return value;
      // },
    },
    {
      label: <FormattedMessage id="read"></FormattedMessage>,
      key: "read",
      render: (_: any, record: any) => (
        <CheckBox
          disabled={updateLoader === record.page_key + "read"}
          label=""
          isChecked={record.permissions.read}
          onChange={() =>
            togglePermission(record?.page_key, "read", record.permissions.read)
          }
        />
      ),
    },
    {
      label: <FormattedMessage id="write"></FormattedMessage>,
      key: "write",
      render: (_: any, record: any) => (
        <CheckBox
          disabled={updateLoader === record.page_key + "write"}
          label=""
          isChecked={record.permissions.write}
          onChange={() =>
            togglePermission(record.page_key, "write", record.permissions.write)
          }
        />
      ),
    },
    {
      label: <FormattedMessage id="update"></FormattedMessage>,
      key: "update",
      render: (_: any, record: any) => (
        <CheckBox
          disabled={updateLoader === record.page_key + "update"}
          label=""
          isChecked={record.permissions.update}
          onChange={() =>
            togglePermission(
              record.page_key,
              "update",
              record.permissions.update
            )
          }
        />
      ),
    },
    {
      label: <FormattedMessage id="delete"></FormattedMessage>,
      key: "delete",
      render: (_: any, record: any) => (
        <CheckBox
          disabled={updateLoader === record.page_key + "delete"}
          label=""
          isChecked={record.permissions.delete}
          onChange={() =>
            togglePermission(
              record.page_key,
              "delete",
              record.permissions.delete
            )
          }
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* <Title level={3}>Permission Management</Title>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
      /> */}

      <DataTable
        columns={columns}
        data={dataSource && Array.isArray(dataSource) ? dataSource : []}
        loading={false}
        Title={
          <div className="flex items-center justify-between pb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <FormattedMessage id="groupPermissions"></FormattedMessage> -
                {" "}<span className="text-primary">
                  {groupName?.[locale] ?? groupName?.["en"]}
                </span>
              </h1>
            </div>
          </div>
        }
        search={false}
      ></DataTable>
    </div>
  );
};

export default PermissionScreen;
