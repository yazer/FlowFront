import { FC, useEffect, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import CheckBox from "./components/CheckBox";
import DependentPopup from "./components/dependentPopup";
import FileUpload from "./components/FileUpload";
import MultiSelectField from "./components/MultiSelectDropdown";
import { elements_type } from "./constants"; // Assuming you have a constants file
import FormElementPreviewContainer from "./FormElementPreviewContainer";
import { activeLanguageData, updateTranslationData } from "./formTranslations";
import AdvancedOptionsWrapper from "./newcompnents/AdvancedOptionsWrapper";
import InputField from "./newcompnents/InputField";
import Dropdown from "../Dropdown/Dropdown";
import { getMethod } from "../../apis/ApiMethod";
import { GET_DB_TABLES } from "../../apis/urls";

export const fileFormatOptions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".svg",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".zip",
  ".rar",
  ".7z",
  ".mp3",
  ".wav",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".html",
  ".css",
  ".js",
  ".json",
  ".xml",
  ".psd",
  ".ai",
  ".eps",
  ".tiff",
  ".ico",
];

interface FileInputInterface {
  formElement: any;
  collapse: any;
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  label?: string;
  isRequired?: boolean;
  activeLanguage: string;
  formData?: any;
}

const UploadDataInput: FC<FileInputInterface> = ({
  formElement,
  collapse,
  onChange,
  label = "",
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState({
    ...formElement,
    id: formElement?.id || "",
    label: label,
    required: formElement?.required || false,
    width: formElement?.width,
    show_all_stages: formElement?.show_all_stages || true,
    element_type: elements_type.UPLOAD_DATA_DYN,
    accept_file_validation: formElement?.accept_file_validation || [],
    enableValidation: formElement?.enableValidation || false,
    max_file_size: formElement?.max_file_size || 0,
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
    tableId: formElement?.tableId || "",
    // Assuming FILE_UPLOAD is in your constants
  });
  const [options, setOptions] = useState<any>([]);
  const { translate } = useTranslation();

  // Handle changes in label and required field
  const updateData = (name: string, value: any, apiCall: boolean) => {
    // const updatedData = { ...data, [name]: value };
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.UPLOAD_DATA_DYN,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, apiCall);
  };

  function getActiveLanguageData(key: string) {
    return activeLanguageData(data, activeLanguage, key);
  }

  async function getTableList() {
    // const data = await fetchTableList();
    const data = await getMethod(GET_DB_TABLES);
    setOptions(data.tables);
  }

  useEffect(() => {
    getTableList();
  }, []);

  console.log(getActiveLanguageData("label"))

  console.log(data)

  const isExpanded = collapse === formElement.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <FileUpload
            label={
              (getActiveLanguageData("label") || translate("labelTextLabel")) +
              (data.required ? " *" : "")
            }
            value={null}
            name=""
            onChange={() => {}}
            disabled={true}
          />
        </FormElementPreviewContainer>
      )}

      {isExpanded && (
        <>
          {/* <LangTab
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          /> */}
          <div className="p-4 space-y-2">
            {/* File Upload Label Input */}
            <InputField
              label={translate("labelTextLabel")}
              placeholder={translate("placeHolderLabel")}
              value={getActiveLanguageData("label")}
              onChange={(value) => {
                updateData("label", value, false); // No API call on change
              }}
              onBlur={(value) => {
                updateData("label", value, true); // Trigger API call on blur
              }}
            />
            <Dropdown
              label={translate("selectTable")}
              options={options}
              labelKey="table_name"
              valueKey="id"
              name=""
              onChange={(e) => {
                const updatedData = { ...data, tableId: e.target.value };
                setData(updatedData);
                onChange(updatedData, true);
              }}
              value={data.tableId}
            />

            <AdvancedOptionsWrapper>
              <DependentPopup
                data={data}
                formData={formData}
                onChange={updateData}
                activeLanguage={activeLanguage}
              />

              <div className="flex items-center gap-4 my-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="validationToggle"
                    value="enable"
                    checked={!!data?.enableValidation}
                    onChange={() => updateData("enableValidation", true, true)}
                  />
                  <span className="ml-2">{translate("enableValidation")}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="validationToggle"
                    value="disable"
                    checked={!data?.enableValidation}
                    onChange={() => updateData("enableValidation", false, true)}
                  />
                  <span className="ml-2">{translate("disableValidation")}</span>
                </label>
              </div>

              {data?.enableValidation && (
                <div className="space-y-4">
                  <MultiSelectField
                    menuHeight="200px"
                    label={translate("AcceptFileFormat")}
                    options={
                      fileFormatOptions?.map((x) => ({
                        label: x,
                        value: x,
                      })) ?? []
                    }
                    name=""
                    // value={data?.accept_file_validation ?? []}
                    value={
                      Array.isArray(data?.accept_file_validation)
                        ? data?.accept_file_validation
                        : []
                    }
                    onChange={(e: any) => {
                      updateData(
                        "accept_file_validation",
                        e.target.value,
                        true
                      );
                    }}
                  />

                  <InputField
                    label={translate("maxFileLabel")}
                    value={data.max_file_size}
                    placeholder={translate("maxFilePlaceholder")}
                    onChange={(value) => {
                      updateData("max_file_size", value, false); // No API call on change
                    }}
                    onBlur={() => {
                      updateData("max_file_size", data?.max_file_size, true); // Trigger API call on blur
                    }}
                  />
                </div>
              )}
            </AdvancedOptionsWrapper>
            <div className="flex mt-4 justify-between">
              <CheckBox
                label={translate("requiredErrorMessage")}
                isChecked={data?.required}
                onChange={(e) => updateData("required", e.target.checked, true)}
              />
              <CheckBox
                label={translate("showAllStages")}
                isChecked={data?.show_all_stages}
                onChange={(e) =>
                  updateData("show_all_stages", e.target.checked, true)
                }
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UploadDataInput;
