import { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import MainLayout from "./layouts/MainLayout";

import { ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import ProtectedRoutes from "./components/protectedRoute/ProtectedRoute";
import { Herirarchy } from "./pages/heirarchy/heirarchy";
import Home from "./pages/home";
import { Inbox } from "./pages/inbox/inbox";
import { Login } from "./pages/login/Login";
import ProcessCreate from "./pages/process/processCreate/ProcessCreate";
import ProcessList from "./pages/process/processList/ProcessList";
import ProcessListV2 from "./pages/process/processList V2/ProcessList";
import { Signup } from "./pages/signup/Signup";
import { WorkFlow } from "./pages/workflow/Workflow";
import WorkFlowV2 from "./pages/workflow V2/Workflow";
import theme from "./theme";
import GlobalContextProvider from "./context/GlobalContextProvider";
import Dashboards from "./pages/dashboard/dashboards/dashboards";
import enMessages from "./locales/en";
import arMessages from "./locales/ar";
import ProcessDashboard from "./pages/dashboard/process";
import ProcessAdministration from "./pages/administration/process/processTable";
import RequestAdministration from "./pages/administration/request/requestTable";
import UserGroupAdministration from "./pages/administration/user-groups/userGroups";
import CategoryAdministration from "./pages/administration/category/category";
import RequestDetail from "./pages/administration/request/requestDetail";
import DepartmentAdministration from "./pages/administration/department/department";
import OrganizationAdministration from "./pages/administration/organization/organization";
import ProcessVersionDetails from "./pages/administration/process/versionDetail";
import StaffAdministration from "./pages/administration/users/users";
import CascadingParentTable from "./pages/administration/cascading-parent-tables/cascadingTable";
import CascadingDependentTables from "./pages/administration/cascading-parent-tables/cascadingDependentTables";
import CascadingColumns from "./pages/administration/cascading-parent-tables/cascadingColumns";
import OrganizationBranch from "./pages/administration/organization-branch/organizationBranch";
import OrganizationSection from "./pages/administration/section/sectionListing";
import { OrganizationProvider } from "./context/OrganizationContext";
import OrganizationTrash from "./pages/administration/trash/trashTable";
import AIChatBox from "./pages/workflow V2/AIChatBox";
import GroupUsers from "./pages/administration/user-groups/groupUserDetails";
import RequestTracks from "./pages/administration/request/requestTracks";
import UploadProgressProvider from "./components/uploadProgress/UploadProgressProvider";
import DataBaseTableRows from "./pages/administration/cascading-parent-tables/DataBaseTableRows";
import DataBaseTable from "./pages/administration/cascading-parent-tables/DataBaseTable";
import PermissionGroups from "./pages/administration/user-groups/permissionGroups";
import LoginTemplate from "./pages/login/LoginTemplate";
import ForgotPassword from "./pages/forgotPassword";
import NotFound from "./pages/404/notFound";
import Forbidden from "./pages/403/forBidden";
import ReportGenerator from "./pages/reportPdf/ReportGenerator";

function App() {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<Record<string, any>>({
    en: enMessages,
    ar: arMessages,
  });

  useEffect(() => {
    setLocale(localStorage.getItem("locale") ?? "en");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalContextProvider>
        <IntlProvider locale={locale} messages={messages?.[locale] || {}}>
          <Toaster />
          <BrowserRouter>
            {!window.location.pathname.includes("/flow-builder") ? (
              <AIChatBox />
            ) : (
              <></>
            )}
            <ReactFlowProvider>
              <Routes>
                <Route
                  path=""
                  element={<Navigate to="/auth/login" replace />}
                />
                <Route path="/404" element={<NotFound />} />

                <Route path="/auth" element={<LoginTemplate />}>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                </Route>

                <>
                  <Route
                    path=""
                    element={
                      <ProtectedRoutes>
                        <OrganizationProvider>
                          <MainLayout
                            locale={locale}
                            handleLocaleChange={(updatedLocale) => {
                              setLocale(updatedLocale);
                              localStorage.setItem("locale", updatedLocale);
                            }}
                          />
                        </OrganizationProvider>
                      </ProtectedRoutes>
                    }
                  >
                    {/* <Route path="/unnoted" element={<WorkLayout />} /> */}
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/process-list" element={<ProcessList />} />

                    {/* <Route path="/reportGen" element={<ReportGenerator />} /> */}
                    <Route
                      path="/process-list/flow-builder/:processId"
                      element={<WorkFlow />}
                    />
                    <Route
                      path="/process-list-v2"
                      element={<ProcessListV2 />}
                    />
                    <Route
                      path="/process-list-v2/flow-builder/:processId"
                      element={<WorkFlowV2 />}
                    />
                    <Route
                      path="/process-list/create-process"
                      element={<ProcessCreate />}
                    />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/heirarchy" element={<Herirarchy />} />
                    <Route
                      path="*"
                      element={
                        <div
                          className="flex items-center justify-center"
                          style={{
                            height: "calc(100vh - 64px)",
                          }}
                        >
                          <h1> 404 Not found </h1>
                        </div>
                      }
                    />
                    <Route
                      path="/inbox/inprogress"
                      element={<Inbox category="inprogress" />}
                    />
                    <Route
                      path="/inbox/completed"
                      element={<Inbox category="completed" />}
                    />
                    <Route path="/dashboard/dashboards" element={<></>} />
                    <Route
                      path="/dashboard/chart-builder"
                      element={<Dashboards />}
                    />
                    <Route
                      path="/dashboard/process-dashboard"
                      element={<ProcessDashboard />}
                    />
                    <Route
                      path="/administration/processes"
                      element={<ProcessAdministration />}
                    />
                    <Route
                      path="/administration/processes/versions/:processId"
                      element={<ProcessVersionDetails />}
                    />
                    <Route
                      path="/administration/requests"
                      element={<RequestAdministration />}
                    />
                    <Route
                      path="/administration/requests/:requestId"
                      element={<RequestDetail />}
                    />
                    <Route
                      path="/administration/requests/tracks/:requestId"
                      element={<RequestTracks />}
                    />
                    <Route
                      path="/administration/categories"
                      element={<CategoryAdministration />}
                    />
                    <Route
                      path="/administration/user-groups"
                      element={<UserGroupAdministration />}
                    />
                    <Route
                      path="/administration/user-groups/users/:groupId"
                      element={<GroupUsers />}
                    />
                    <Route
                      path="/administration/user-groups/permissions/:groupId"
                      element={<PermissionGroups />}
                    />
                    <Route
                      path="/administration/departments/:branchId"
                      element={<DepartmentAdministration />}
                    />
                    <Route
                      path="/administration/organization"
                      element={<OrganizationAdministration />}
                    />
                    <Route
                      path="/administration/user-list"
                      element={<StaffAdministration />}
                    />

                    <Route
                      path="/administration/parent-tables"
                      element={<Outlet />}
                    >
                      <Route
                        index
                        element={
                          <UploadProgressProvider>
                            <CascadingParentTable />
                          </UploadProgressProvider>
                        }
                      />

                      <Route path="database" element={<DataBaseTable />} />
                      <Route
                        path="database/:tableId"
                        element={<DataBaseTableRows />}
                      />
                    </Route>

                    <Route
                      path="/administration/database/dependent-tables/:tableId"
                      element={<CascadingDependentTables />}
                    />
                    <Route
                      path="/administration/database/column-values/:tableId"
                      element={<CascadingColumns />}
                    />
                    <Route
                      path="/administration/organization-branch"
                      element={<OrganizationBranch />}
                    />
                    <Route
                      path="/administration/organization-section/:departmentId"
                      element={<OrganizationSection />}
                    />
                    <Route
                      path="/administration/trash"
                      element={<OrganizationTrash />}
                    />
                  </Route>
                </>
              </Routes>
            </ReactFlowProvider>
          </BrowserRouter>
        </IntlProvider>
      </GlobalContextProvider>
    </ThemeProvider>
  );
}

export default App;
