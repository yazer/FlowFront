import { FC, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import CheckBox from "./components/CheckBox";
import DependentPopup from "./components/dependentPopup";
import MultiFileUpload from "./components/MultiFileUpload";
import MultiSelectField from "./components/MultiSelectDropdown";
import { elements_type } from "./constants"; // Assuming you have a constants file
import { fileFormatOptions } from "./FileInput";
import FormElementPreviewContainer from "./FormElementPreviewContainer";
import { activeLanguageData, updateTranslationData } from "./formTranslations";
import AdvancedOptionsWrapper from "./newcompnents/AdvancedOptionsWrapper";
import InputField from "./newcompnents/InputField";

interface FileInputInterface {
  formElement: any;
  collapse: any;
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  label?: string;
  isRequired?: boolean;
  activeLanguage: string;
  formData: string;
}

const MultiFileInput: FC<FileInputInterface> = ({
  formElement,
  collapse,
  onChange,
  label = "",
  activeLanguage,
  formData,
}) => {
  const { translate } = useTranslation();
  const [data, setData] = useState({
    ...formElement,
    id: formElement.id,
    show_all_stages: formElement.show_all_stages || true,
    label: label,
    width: formElement?.width,
    required: formElement.required || false,
    element_type: elements_type.MULTIFILEUPLOAD,
    enableValidation: formElement.enableValidation || false,
    accept_file_validation: formElement.accept_file_validation || [],
    max_file_size: formElement.max_file_size || 0,
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,

    // Assuming FILE_UPLOAD is in your constants
  });

  // Handle changes in label and required field
  const updateData = (name: string, value: any, apiCall: boolean) => {
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.FILEUPLOAD,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, apiCall);
  };

  function getActiveLanguageData(key: string) {
    return activeLanguageData(data, activeLanguage, key);
  }
  const isExpanded = collapse === formElement.id;

  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <MultiFileUpload
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
        <div className="p-4">
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

          <AdvancedOptionsWrapper>
            <>
              <DependentPopup
                data={data}
                formData={formData}
                onChange={updateData}
                activeLanguage={activeLanguage}
              />

              <div className="flex items-center gap-4 my-4 ">
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
                    value={data?.max_file_size}
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
            </>
          </AdvancedOptionsWrapper>

          <div className="flex justify-between mt-4">
            {/* Checkbox for Required */}
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
      )}
    </>
  );
};

export default MultiFileInput;
