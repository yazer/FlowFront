import {
  AddOutlined,
  CloseOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import useTranslation from "../../../hooks/useTranslation";
import Dropdown from "../../Dropdown/Dropdown";
import CheckBox from "./Addons/CheckBox";
import { elements_type } from "../constants";
import {
  activeLanguageData,
  updateTranslationData,
  updateTranslationOptions,
} from "../formTranslations";
import InputField from "./InputField";
import DependentPopup from "../components/dependentPopup";
import {
  fetchDependantTables,
  fetchTableList,
} from "../../../apis/flowBuilder";
import DialogCustomized from "../../Dialog/DialogCustomized";
import { Button, Stack, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import FormElementPreviewContainer from "../FormElementPreviewContainer";

interface DropDownInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (value: any, api_call?: boolean) => void;
  ar: { label?: string; options: { value: string; label: string }[] };
  en: { label?: string; options: { value: string; label: string }[] };
  name?: any;
  activeLanguage: any;
  formData: any;
}

const DropDown: FC<DropDownInterface> = ({
  collapse,
  formElement,
  onChange,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState<{
    id: string;
    label: string;
    options: string[];
    required: boolean;
    show_all_stages: boolean;
    width: string;
    element_type: string;
    translate?: any;
    dependentDetails: any;
    dropdownDetails: any;
    enableDependent: boolean;
    enableCascading: boolean;
  }>({
    element_type: elements_type.DROPDOWN,
    id: formElement?.id || "",
    label: formElement?.label || "",
    required: formElement?.required || false,
    options: formElement?.options || [""],
    show_all_stages: formElement?.show_all_stages || true,
    width: formElement?.width,
    translate: {
      en: { options: [{ label: "" }] },
      ar: { options: [{ label: "" }] },
      ...formElement.translate,
    },
    enableDependent: formElement?.enableDependent || false,
    enableCascading: formElement?.enableCascading || false,
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    dropdownDetails: formElement?.dropdownDetails ?? {},
  });

  const [settingsValues, setSettingsValues] = useState(
    formElement?.dropdownDetails
  );
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [tableOptions, setTableOptions] = useState([]);

  const [isAdvancedOptions, setIsAdvancedOptions] = useState(false);

  // const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");
  const { translate } = useTranslation();

  const handleChange = (value: string, index: number, call_api?: boolean) => {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "edit",
      index,
      value
    );
    setData(updatedData);
    call_api && onChange(updatedData, true);
  };

  const addOption = () => {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "add",
      0,
      ""
    );
    setData(updatedData);
  };

  const removeOption = (index: number) => {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "delete",
      index,
      ""
    );
    setData(updatedData);
  };

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    onChange(data, call_api);
  }

  function updateCheckBox(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    let updatedData = {
      ...data,
      [name]: value,
    };
    if (name === "enableCascading") {
      if (data.enableDependent === true) {
        updatedData.enableDependent = false;
      }
    }

    if (name === "enableDependent") {
      if (data.enableCascading === true) {
        updatedData.enableCascading = false;
      }
    }

    setData(updatedData);
    onChange(updatedData, call_api);
  }

  function updateLabel(value: string, call_api?: boolean) {
    const updatedData = updateTranslationData(
      data,
      "label",
      elements_type.DROPDOWN,
      value,
      activeLanguage
    );
    setData(updatedData);
    call_api && onChange(updatedData, true);
  }

  const mapOptions = () => {
    setSettingsDialog(true);
    let tableId = formData?.find(
      (item: any) => item.id === data?.dropdownDetails?.parentId
    )?.dropdownDetails?.tableId;
    if (tableId) {
      GetDependantTableList(tableId);
    } else {
      GetTableList();
    }
  };

  const GetTableList = async () => {
    try {
      const res = await fetchTableList();
      setTableOptions(res ?? []);
    } catch (error) {}
  };

  const GetDependantTableList = async (parentId: string) => {
    try {
      const res = await fetchDependantTables(parentId);
      setTableOptions(res ?? []);
    } catch (error) {}
  };
  const handleTableDropdown = (value: string, name: string) => {
    // GetColumnList(value);
    let tableId = formData?.find((item: any) => item.id === value)
      ?.dropdownDetails?.tableId;
    setSettingsValues((prev: any) => ({ ...prev, [name]: value }));

    if (name === "parentId") {
      if (tableId) {
        GetDependantTableList(tableId);
      } else {
        toast.error("Parent Element not mapped with table");
      }
    }
  };

  const handleMapSubmit = () => {
    let updatedValue = { ...data, dropdownDetails: settingsValues };
    setSettingsDialog(false);
    setTableOptions([]);
    onChange(updatedValue, true);
    setData(updatedValue);
  };

  const activeData = (key: string) => {
    return activeLanguageData(data, activeLanguage, key);
  };

  const isExpanded = collapse === formElement?.id;

  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <Dropdown
            label={
              (activeData("label") || translate("labelTextLabel")) +
              (data.required ? " *" : "")
            }
            options={
              data?.translate?.[activeLanguage]?.options?.map((x: any) => ({
                label: typeof x === "object" ? x.label : x,
                value: typeof x === "object" ? x.label : x,
              })) ?? []
            }
            value=""
            name=""
            onChange={() => {}}
          />
        </FormElementPreviewContainer>
      )}
      {isExpanded && (
        <>
          {/* Form Content */}
          <div className="p-4">
            <InputField
              label={translate("labelTextLabel")}
              placeholder={translate("placeHolderLabel")}
              value={data?.translate[activeLanguage].label}
              onChange={(value) => updateLabel(value, false)}
              onBlur={(value) => updateLabel(value, true)}
            />

            <Stack direction={"row"} alignItems={"center"} gap={2} mt={2}>
              <CheckBox
                label={translate("enableCascading")}
                isChecked={data?.enableCascading}
                onChange={(e: any) => {
                  if (data?.enableDependent) {
                    updateCheckBox("enableDependent", false, true);
                  }
                  if (e.target.checked) {
                    setSettingsDialog(true);
                    mapOptions();
                  }
                  updateCheckBox("enableCascading", e.target.checked, true);
                }}
              />
              <Button
                startIcon={<AiFillEdit />}
                size="small"
                onClick={() => {
                  mapOptions();
                  setSettingsDialog(true);
                }}
              >
                <FormattedMessage id="editDependentDetails"></FormattedMessage>
              </Button>
            </Stack>
            <Stack alignItems="flex-end">
              <Button
                startIcon={
                  isAdvancedOptions ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )
                }
                onClick={() => setIsAdvancedOptions((state) => !state)}
              >
                {translate("form.advancedOptions")}
              </Button>
            </Stack>
            {isAdvancedOptions && (
              <div className="border-grey-300 border rounded-md p-4 space-y-4">
                <DependentPopup
                  data={data}
                  formData={formData}
                  onChange={updateCheckBox}
                  activeLanguage={activeLanguage}
                />

                {!data.enableCascading && (
                  <>
                    <Typography variant="h6">
                      <FormattedMessage id="optionsForDropdown"></FormattedMessage>
                    </Typography>
                    {data?.translate[activeLanguage]?.options?.map(
                      (option: any, index: any) => (
                        <div className="flex flex-col mt-4 gap-y-2" key={index}>
                          <div className="flex flex-col md:flex-row gap-2 items-end jusify-center w-full">
                            <InputField
                              label={translate("optionLabel")}
                              placeholder={translate("optionLabelPlaceholder")}
                              value={option.label}
                              onChange={(value) => handleChange(value, index)}
                              onBlur={(value) =>
                                updateData("options", value, true)
                              }
                            />

                            {index === data?.options?.length - 1 ? (
                              // Add Button for the last option
                              <button
                                type="button"
                                onClick={addOption}
                                className="text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full p-2.5 inline-flex items-center"
                              >
                                <AddOutlined />
                              </button>
                            ) : (
                              // Close Button for all other options
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full p-2.5 inline-flex items-center"
                              >
                                <CloseOutlined />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex pl-4 pr-4 pb-4 justify-between">
            <CheckBox
              label={translate("requiredErrorMessage")}
              isChecked={data.required}
              onChange={(e: any) =>
                updateCheckBox("required", e.target.checked, true)
              }
            />
            <CheckBox
              label={translate("showAllStages")}
              isChecked={data.show_all_stages}
              onChange={(e) =>
                updateCheckBox("show_all_stages", e.target.checked, true)
              }
            />
          </div>
        </>
      )}

      <DialogCustomized
        open={settingsDialog}
        handleClose={() => setSettingsDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setSettingsDialog(false)}>
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleMapSubmit}
            >
              {translate("submitButton")}
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            {formData.filter(
              (x: any) =>
                x?.element_type === elements_type.DROPDOWN &&
                x?.enableCascading &&
                x.id !== data.id
            ).length > 0 && (
              <Dropdown
                label={translate("selectParentElement")}
                options={
                  formData
                    ?.filter(
                      (x: any) =>
                        x?.element_type === elements_type.DROPDOWN &&
                        x?.enableCascading &&
                        x.id !== data.id
                    )
                    ?.map((x: any) => ({
                      label: x?.translate?.[activeLanguage]?.label ?? "Label",
                      value: x?.id,
                    })) ?? []
                }
                value={settingsValues?.parentId}
                name=""
                onChange={(e) =>
                  handleTableDropdown(e?.target?.value, "parentId")
                }
              />
            )}
            <Dropdown
              label={translate("selectTable")}
              options={
                tableOptions?.map((x: any) => ({
                  label: x?.name,
                  value: x?.id,
                })) ?? []
              }
              value={settingsValues?.tableId}
              name=""
              onChange={(e) => handleTableDropdown(e?.target?.value, "tableId")}
            />
          </Stack>
        }
        title={translate("sidemenuSettings")}
      />
    </>
  );
};

export default DropDown;
