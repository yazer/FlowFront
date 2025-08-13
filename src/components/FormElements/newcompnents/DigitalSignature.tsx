import React, { useState } from "react";
import InputField from "./InputField";
import { elements_type } from "../constants";
import CheckBox from "../components/CheckBox";
import { activeLanguageData, updateTranslationData } from "../formTranslations";
import useTranslation from "../../../hooks/useTranslation";
import FormElementPreviewContainer from "../FormElementPreviewContainer";

function DigitalSignature(props: any) {
  const { onChange, collapse, formElement, activeLanguage }: any = props;
  // const [activeLanguage, setActiveLanguage] = useState("en");
  const { translate } = useTranslation();
  const [data, setData] = useState({
    element_type: elements_type.DIGITASIGNATURE,
    id: formElement?.id || "",
    label: formElement?.label || "",
    required: formElement?.required || false,
    show_all_stages: formElement?.show_all_stages || true,
    width: formElement?.width,
    translate: formElement.translate,
  });

  const updateData = (name: string, value: any, apiCall: boolean) => {
    // const updatedData = { ...data, [name]: value };
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.DIGITASIGNATURE,
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
          <InputField
            label={
              (getActiveLanguageData("label") || "Label") +
              (data.required ? " *" : "")
            }
            value=""
            name=""
            placeholder=""
            onChange={() => {}}
          />
        </FormElementPreviewContainer>
      )}{" "}
      {isExpanded && (
        <>
          <div className="p-4">
            <InputField
              label={translate("label")}
              value={getActiveLanguageData("label")}
              placeholder={translate("label")}
              onChange={(value) => {
                updateData("label", value, false); // No API call on change
              }}
              onBlur={(value) => {
                updateData("label", value, true); // Trigger API call on blur
              }}
            />
            <div className="flex mt-4 justify-between">
              <CheckBox
                label={translate("requiredErrorMessage")}
                isChecked={data?.required}
                onChange={(e) => updateData("required", e.target.checked, true)}
              />
              <CheckBox
                label={translate("showForAllStages")}
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
}

export default DigitalSignature;
