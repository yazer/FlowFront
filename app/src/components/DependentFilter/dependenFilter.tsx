import { InfoOutlined } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Collapse,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  fetchBranchesFilter,
  fetchCategoriesFilter,
  fetchDeparmentsFilter,
  fetchSectionDetailsFilter,
} from "../../apis/administration";
import { postMethod } from "../../apis/ApiMethod";
import { UPDATE_FILTER_STATUS } from "../../apis/urls";
import { useOrganization } from "../../context/OrganizationContext";
import useTranslation from "../../hooks/useTranslation";
import Chip from "../Chip/Chip";
import SearchableDropdown from "../searchableDropdown/searchableDropdown";
const initialFilterValue = {
  category: "",
  department: "",
  branch: "",
  section: "",
  process: "",
};

export type typeSelectedFilters = {
  category: string;
  department: string;
  branch: string;
  section: string;
  process?: string;
};

type Props = {
  fetchWithFilter: Function;
  selectedFilter: typeSelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<typeSelectedFilters>>;
  isProcessFilter?: boolean;
};
function DependentFilter({
  fetchWithFilter,
  selectedFilter,
  setSelectedFilters,
  isProcessFilter,
}: Props) {
  const { locale } = useIntl();
  const { translate } = useTranslation();
  const { userFilterData, refreshUserData } = useOrganization();

  const [isUserFilterActive, setIsUserFilterActive] = useState(false);
  const [rememberUserFilter, setRememberUserFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState(initialFilterValue);
  const [hasInitializedFilter, setHasInitializedFilter] = useState(false);

  // const [selectedFilter, setSelectedFilters] = useState(initialFilterValue);

  const [openFilter, setOpenFilter] = useState(true);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [sectionList, setSectionList] = useState<any[]>([]);

  useEffect(() => {
    if (userFilterData?.show_filter && !hasInitializedFilter) {
      setSelectedFilters((prev) => ({
        ...prev,
        branch: userFilterData?.branch,
        department: userFilterData?.department,
        section: userFilterData?.section,
      }));
      // fetchWithFilter(
      //   userFilterData?.branch,
      //   userFilterData?.department,
      //   userFilterData?.section,
      //   selectedFilter?.category
      // );
      setRememberUserFilter(true);
      setHasInitializedFilter(true);
    }
  }, [userFilterData]);

  useEffect(() => {
    getBranchList(searchFilters?.branch);
  }, [searchFilters?.branch]);

  useEffect(() => {
    if (selectedFilter?.branch)
      getDeparmentList(selectedFilter?.branch, searchFilters?.department);
  }, [searchFilters?.department, selectedFilter?.branch]);

  useEffect(() => {
    if (selectedFilter?.department)
      getSectionList(selectedFilter?.department, searchFilters?.section);
  }, [searchFilters?.section, selectedFilter?.department]);

  useEffect(() => {
    getCategoryList(searchFilters.category);
  }, [searchFilters.category]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     fetchWithFilter(
  //       searchFilters.branch,
  //       searchFilters.department,
  //       searchFilters.section,
  //       searchFilters.category,
  //       searchFilters.process
  //     );
  //   }, 500); // 500ms delay

  //   return () => clearTimeout(delayDebounce);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchFilters.process]);

  const getDeparmentList = async (branchId: string, search: any) => {
    try {
      const res = await fetchDeparmentsFilter(branchId, search);
      setDepartmentList(res?.results ?? []);
    } catch (error) {}
  };

  const getCategoryList = async (search: string) => {
    try {
      const res = await fetchCategoriesFilter(search);
      setCategoryList(res?.results ?? []);
    } catch (error) {}
  };

  const getBranchList = async (search: string) => {
    try {
      const res = await fetchBranchesFilter(search);
      setBranchList(res?.results ?? []);
    } catch (error) {}
  };
  const getSectionList = async (departmentId: string, search: string) => {
    try {
      const res = await fetchSectionDetailsFilter(departmentId, search);
      setSectionList(res?.results ?? []);
    } catch (error) {}
  };

  const handleSearchFields = (name: string, value: string) => {
    setSearchFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  const isClearButton =
    userFilterData?.branch === selectedFilter?.branch &&
    userFilterData?.department === selectedFilter?.department &&
    userFilterData?.section === selectedFilter?.section;

  const toggleUserFilters = () => {
    if (isClearButton) {
      setSelectedFilters((prev) => ({
        ...prev,
        branch: "",
        department: "",
        section: "",
      }));
      fetchWithFilter(
        undefined,
        undefined,
        undefined,
        selectedFilter?.category
      );
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        branch: userFilterData?.branch,
        department: userFilterData?.department,
        section: userFilterData?.section,
      }));

      fetchWithFilter(
        userFilterData?.branch,
        userFilterData?.department,
        userFilterData?.section,
        selectedFilter?.category
      );
      // applyUserFilters();
    }
    setIsUserFilterActive((prev) => !prev);
  };

  const onClickRememberFilter = async (value: boolean) => {
    const payload = {
      show_filter: value,
    };
    setRememberUserFilter(value);
    try {
      await postMethod(UPDATE_FILTER_STATUS, payload);
      refreshUserData();
    } catch (error) {
      console.log(error);
    }
  };

  function getValuesBasedOnID(key: string, value: string) {
    if (key === "branch") {
      return branchList.find((item) => item.uuid === value)?.translations?.[
        locale
      ];
    } else if (key === "department") {
      return departmentList.find((item) => item.uuid === value)?.translations?.[
        locale
      ]?.name;
    } else if (key === "section") {
      return sectionList.find((item) => item.uuid === value)?.translations?.[
        locale
      ];
    } else if (key === "category") {
      return categoryList.find((item) => item.uuid === value)?.translations?.[
        locale
      ]?.category;
    }
    return "N/A";
  }

  const handleFilterDelete = (key: string) => {
    setSelectedFilters({ ...selectedFilter, [key]: "" });
  };

  console.log(selectedFilter);

  return (
    <div className="w-full">
      <div
        className={`bg-white rounded-lg shadow-md px-4 ${
          openFilter ? "py-2" : "py-1"
        } w-full`}
      >
        <div>
          <div className="flex items-center justify-end gap-4 ">
            <div className="flex items-center justify-end w-full gap-5">
              <>
                {!Object.values(selectedFilter).every((v) => !v) ? (
                  <Stack flex={1} direction="row" gap={1}>
                    <Typography variant="subtitle1">Filters : </Typography>
                    {Object.entries(selectedFilter).map(([key, values]) =>
                      values ? (
                        <Chip
                          key={key}
                          value={getValuesBasedOnID(key, values)}
                          type="grey"
                          isDelete={true}
                          onDelete={() => handleFilterDelete(key)}
                        />
                      ) : null
                    )}
                  </Stack>
                ) : (
                  <div className="flex-1 flex align-center gap-1 text-gray-400">
                    <InfoOutlined className="h-5 w-5" /> Empty Filters
                  </div>
                )}
              </>
              {/* Default On Load Checkbox */}
              {openFilter ? (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rememberUserFilter}
                        onChange={(e) =>
                          onClickRememberFilter(e.target.checked)
                        }
                      />
                    }
                    label={
                      <FormattedMessage
                        id={"rememberUserFilter"}
                      ></FormattedMessage>
                    }
                  />
                </>
              ) : (
                // <label className="flex items-center gap-2 text-sm text-gray-700">
                //   <input
                //     type="checkbox"
                //     checked={rememberUserFilter}
                //     onChange={(e) => {
                //       onClickRememberFilter(e.target.checked);
                //     }}
                //   />
                //   <FormattedMessage
                //     id={"rememberUserFilter"}
                //   ></FormattedMessage>
                // </label>
                <></>
              )}
              <IconButton
                size="small"
                onClick={() => setOpenFilter(!openFilter)}
              >
                {openFilter ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </div>
          </div>

          <Collapse orientation="vertical" in={openFilter}>
            <div className="flex items-center gap-4 mt-3">
              {isProcessFilter && (
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    {<FormattedMessage id="filterProcess"></FormattedMessage>}
                  </label>

                  <input
                    type="text"
                    value={searchFilters?.process ?? ""}
                    onChange={(e) => {
                      handleSearchFields("process", e.target.value);
                      fetchWithFilter(
                        searchFilters.branch,
                        searchFilters.department,
                        searchFilters.section,
                        searchFilters.category,
                        e.target.value
                      );

                      setSelectedFilters((prev) => ({
                        ...prev,
                        process: e.target.value,
                      }));
                    }}
                    placeholder={translate("placeholderProcess")}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="w-full">
                <SearchableDropdown
                  label={
                    <FormattedMessage id="filterBranch"></FormattedMessage>
                  }
                  selected={selectedFilter?.branch}
                  onChange={(value: string) => {
                    fetchWithFilter(
                      value,
                      undefined,
                      undefined,
                      selectedFilter.category,
                      selectedFilter.process
                    );

                    setSelectedFilters((prev) => ({
                      ...prev,
                      branch: value,
                      section: "",
                      department: "",
                    }));
                  }}
                  options={
                    branchList?.map((item: any) => ({
                      label: item?.translations?.[locale],
                      value: item.uuid,
                    })) ?? []
                  }
                  onChangeSearch={(value: string) =>
                    handleSearchFields("branch", value)
                  }
                  placeholder={"placeholderBranch"}
                ></SearchableDropdown>
              </div>
              <div className="w-full">
                <SearchableDropdown
                  label={
                    <FormattedMessage id="filterDepartment"></FormattedMessage>
                  }
                  selected={selectedFilter?.department}
                  onChange={(value: string) => {
                    fetchWithFilter(
                      selectedFilter?.branch,
                      value,
                      undefined,
                      selectedFilter?.category,
                      selectedFilter.process
                    );

                    setSelectedFilters((prev) => ({
                      ...prev,
                      section: "",
                      department: value,
                    }));
                  }}
                  options={
                    departmentList?.map((item: any) => ({
                      label: item?.translations?.[locale]?.name,
                      value: item?.uuid,
                    })) ?? []
                  }
                  disabled={!selectedFilter?.branch}
                  onChangeSearch={(value: string) =>
                    handleSearchFields("department", value)
                  }
                  placeholder={"placeholderDeparment"}
                ></SearchableDropdown>
              </div>
              <div className="w-full">
                <SearchableDropdown
                  label={<FormattedMessage id="filterSection" />}
                  selected={selectedFilter?.section}
                  onChange={(value: string) => {
                    fetchWithFilter(
                      selectedFilter?.branch,
                      selectedFilter?.department,
                      value,
                      selectedFilter?.category,
                      selectedFilter.process
                    );

                    setSelectedFilters((prev) => ({
                      ...prev,
                      section: value,
                    }));
                  }}
                  options={
                    sectionList?.map((item: any) => ({
                      label: item?.translations?.[locale],
                      value: item.uuid,
                    })) ?? []
                  }
                  onChangeSearch={(value: string) =>
                    handleSearchFields("section", value)
                  }
                  disabled={!selectedFilter?.department}
                  placeholder={"placeholderSection"}
                />
              </div>
              <div className="w-full">
                <SearchableDropdown
                  label={<FormattedMessage id="filterCategory" />}
                  selected={selectedFilter?.category}
                  onChange={(value: string) => {
                    fetchWithFilter(
                      selectedFilter?.branch,
                      selectedFilter?.department,
                      selectedFilter?.section,
                      value,
                      selectedFilter.process
                    );

                    setSelectedFilters((prev) => ({
                      ...prev,
                      category: value,
                    }));
                  }}
                  options={
                    categoryList?.map((item: any) => ({
                      label: item?.translations?.[locale]?.category,
                      value: item.uuid,
                    })) ?? []
                  }
                  onChangeSearch={(value: string) =>
                    handleSearchFields("category", value)
                  }
                  // disabled={!selectedDepartment}
                  placeholder={"placeholderCategory"}
                ></SearchableDropdown>
              </div>

              <div className="h-[66px] flex items-end w-full">
                <button
                  type="button"
                  onClick={toggleUserFilters}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium border transition ${
                    !isClearButton
                      ? "bg-primary text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <FormattedMessage
                    id={isClearButton ? "clearUserFilter" : "applyUserFilter"}
                  />
                </button>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
}

export default DependentFilter;
