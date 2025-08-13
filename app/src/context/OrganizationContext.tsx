import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getMethod } from "../apis/ApiMethod";
import { fetchOrganization } from "../apis/organization";
import { GET_PERMISSIONS, GET_USER_PROFILE } from "../apis/urls";
import { PermissionKeyType, ScreenKeyType } from "../utils/permissions";

interface OrganizationContextType {
  organizationData: any;
  userFilterData: any;
  permissionData: any;
  refreshOrganizationData: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshPermissionData: () => Promise<void>;
  usePermissions: (
    screen_key?: ScreenKeyType | undefined
  ) => {
    canEdit: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canView: boolean;
  };
  getPermission: (
    screen_key: ScreenKeyType | undefined,
    permission_key: PermissionKeyType
  ) => ScreenKeyType;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organizationData, setOrganizationData] = useState<any>({});
  const [userFilterData, setUserFilterData] = useState(null);
  const [permissionData, setPermissionData] = useState<any>(null);

  const location = useLocation();

  useEffect(() => {
    // if (
    //   permissionData &&
    //   !permissionData?.[matchScreenKey(location?.pathname) ?? ""]?.read
    // ) {
    //   navigate("/forbidden");
    // }
  }, [location.pathname, permissionData]);

  const fetchOrganizationData = async () => {
    try {
      const res = await fetchOrganization();
      setOrganizationData(res);
    } catch (err) {
      console.error("Failed to fetch organization data", err);
    }
  };

  const fetchOrganizationFilterData = async () => {
    try {
      const res = await getMethod(GET_USER_PROFILE);
      setUserFilterData(res);
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  const fetchPermissionData = async () => {
    try {
      const res = await getMethod(GET_PERMISSIONS);

      setPermissionData(res);
    } catch (err) {
      console.error("Failed to fetch Filter data", err);
    }
  };

  const usePermissions = (screen_key?: ScreenKeyType | undefined) => {
    if (screen_key) {
      return {
        canEdit: permissionData?.[screen_key]?.update ?? false,
        canWrite: permissionData?.[screen_key]?.write ?? false,
        canDelete: permissionData?.[screen_key]?.delete ?? false,
        canView: permissionData?.[screen_key]?.read ?? false,
      };
    } else {
      return {
        canEdit: false,
        canWrite: false,
        canDelete: false,
        canView: false,
      };
    }
  };

  const getPermission = (
    screen_key: ScreenKeyType | undefined,
    permission_key: PermissionKeyType
  ) => {
    if (screen_key) {
      return permissionData?.[screen_key ?? ""]?.[permission_key];
    } else {
    }
  };

  useEffect(() => {
    fetchOrganizationData();
    fetchOrganizationFilterData();
    fetchPermissionData();
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organizationData,
        userFilterData,
        permissionData,
        refreshOrganizationData: fetchOrganizationData,
        refreshUserData: fetchOrganizationFilterData,
        refreshPermissionData: fetchPermissionData,
        usePermissions: usePermissions,
        getPermission: getPermission,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
