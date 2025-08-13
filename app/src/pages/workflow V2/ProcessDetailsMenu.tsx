import InfoOutlined from "@mui/icons-material/InfoOutlined";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import * as React from "react";
import { useIntl } from "react-intl";
import TranslationSummary from "../../containers/summary/TranslationSummary";
import { listLanguages } from "../../apis/process";
import {
  fetchBranchesFilter,
  fetchCategoriesFilter,
  fetchDeparmentsFilter,
  fetchSectionDetailsFilter,
} from "../../apis/administration";

export default function GroupedMenu({
  processDetails,
}: {
  processDetails: any;
}) {
  const { locale } = useIntl();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null
  );
  const [languages, setLanguages] = React.useState<any[]>([]);

  const [categories, setCategories] = React.useState<Array<any>>([]);
  const [departments, setDepartments] = React.useState<Array<any>>([]);
  const [branches, setBranches] = React.useState<Array<any>>([]);
  const [sections, setSections] = React.useState<Array<any>>([]);

  const formDataCommon = {
    department: processDetails.department ?? "",
    description: processDetails.description || "",
    branch: processDetails.branch || "",
    section: processDetails.section || "",
    category: processDetails.category || { [locale]: {} },
  };
  const open = Boolean(anchorEl);

  const getDepartmentList = async (branchId: string) => {
    if (branchId) {
      try {
        const data = await fetchDeparmentsFilter(branchId);
        setDepartments(data.results);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getBranchList = async () => {
    try {
      const data = await fetchBranchesFilter();
      setBranches(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const getSectionList = async (departmentId: string) => {
    if (departmentId) {
      try {
        const data = await fetchSectionDetailsFilter(departmentId);
        setSections(data.results);
      } catch (error) {
        console.log("sections API", error);
      }
    }
  };

  const getCategoriesList = async () => {
    try {
      const data = await fetchCategoriesFilter();
      setCategories(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const getLanguages = async () => {
      try {
        const data = await listLanguages();
        setLanguages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getLanguages();
    getDepartmentList(processDetails.branch);
    getBranchList();
    getSectionList(processDetails.department);
    getCategoriesList();
  }, []);

  function getTranslatedText(data: any, key: string) {
    return data?.[locale]?.[key] || data?.[key];
  }

  return (
    <Box>
      <IconButton
        size="small"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        <InfoOutlined />
      </IconButton>
      <Menu
        id="grouped-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack direction="row">
          <div className="flex-1 min-w-0 ltr:text-left rtl:text-right px-2.5">
            <div className="flex items-center gap-2">
              <Avatar
                src={processDetails.icon_url}
                sizes="20"
                component={Paper}
              >
                {processDetails.icon_url
                  ? processDetails?.name?.[0]
                  : undefined}
              </Avatar>
              <Stack>
                <div className="text-sm font-medium text-gray-900 ltr:pr-2 rtl:pl-2">
                  {getTranslatedText(processDetails.translations, "name")}
                  {getTranslatedText(processDetails.translations, "category") &&
                  getTranslatedText(processDetails.translations, "name")
                    ? " - "
                    : ""}
                  {getTranslatedText(processDetails.translations, "category")}
                </div>
                <Typography>{processDetails.created_by}</Typography>
              </Stack>
            </div>
          </div>
        </Stack>
        <Stack spacing={2} width="500px" margin="10px">
          {Object.entries(processDetails.translations).map(
            ([key, form]: any) => (
              <TranslationSummary
                isEditBtn={false}
                language={
                  languages.find((lang) => lang.code === (form.language || key))
                    ?.name
                }
                handleEdit={() => {}}
                keys={[
                  { label: "name", value: "name" },
                  { label: "category", value: "categoryLabel" },
                  { label: "description", value: "description" },
                  { label: "remarks", value: "remarks" },
                  { label: "branch", value: "branchLabel" },
                  { label: "department", value: "deparmentLabel" },
                  { label: "section", value: "sectionLabel" },
                ]}
                languageConfig={{
                  ...form,
                  categoryLabel:
                    categories.find(
                      (cat) => cat.uuid === formDataCommon?.category
                    )?.translations[form?.language || key]?.category ?? "",
                  branchLabel: branches?.find(
                    (cat) => cat.uuid === formDataCommon?.branch
                  )?.translations?.[form?.language || key],
                  deparmentLabel: departments?.find(
                    (cat) => cat.uuid === formDataCommon?.department
                  )?.translations?.[form?.language || key]?.name,
                  sectionLabel: sections?.find(
                    (cat) => cat.uuid === formDataCommon?.section
                  )?.translations?.[form?.language || key],
                }}
              />
            )
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
