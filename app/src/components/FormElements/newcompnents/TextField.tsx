import { FC, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useTranslation from "../../../hooks/useTranslation";
import Dropdown from "../../Dropdown/Dropdown";
import { elements_type } from "../constants";
import { activeLanguageData, updateTranslationData } from "../formTranslations";
import CheckBox from "./Addons/CheckBox";
import InputField from "./InputField";
import DependentPopup from "../components/dependentPopup";
import FormElementPreviewContainer from "../FormElementPreviewContainer";
import { Button, Stack } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Start } from "@mui/icons-material";
import AdvancedOptionsWrapper from "./AdvancedOptionsWrapper";

interface TextFieldInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (value: any, call_api?: boolean) => void;
  ar: any;
  en: any;
  name?: string;
  validation?: any;
  activeLanguage: any;
  formData?: any;
}

const TextField: FC<TextFieldInterface> = ({
  collapse,
  onChange,
  name,
  formElement,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState({
    id: formElement?.id || "",
    label: formElement?.label || "",
    placeholder: formElement?.placeholder || "",
    min_length: formElement?.min_length || "",
    max_length: formElement?.max_length || "",
    min_value: formElement?.min_value || "",
    max_value: formElement?.max_value || "",
    regularExpression: formElement?.regularExpression || "",
    // width: formElement.width || undefined,
    required: formElement.required || false,
    show_all_stages: formElement.show_all_stages || true,
    name: name || "",
    element_type: elements_type.TEXTFIELD,
    input_type: formElement.input_type || "string",
    // input_data_type: formElement.input_data_type || "string",
    width: formElement?.width,
    enableValidation: formElement.enableValidation || false,
    translate: {
      ar: {
        label: formElement?.translate?.ar?.label || "",
        placeholder: formElement?.translate?.ar?.placeholder || "",
      },
      en: {
        label: formElement?.translate?.en?.label || "",
        placeholder: formElement?.translate?.en?.placeholder || "",
      },
    } as { [key: string]: { label: any; placeholder: any } },
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
  });
  const { locale } = useIntl();
  const [isAdvancedOptions, setIsAdvancedOptions] = useState(false);

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    let updatedData = updateTranslationData(
      data,
      name,
      elements_type.TEXTFIELD,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, call_api);
  }

  const options: any = {
    en: [
      { label: "String", value: "string" },
      { label: "Number", value: "number" },
      { label: "Float", value: "float" },
    ],
    ar: [
      { label: "نص", value: "string" },
      { label: "رقم", value: "number" },
      { label: "عدد عشري", value: "float" },
    ],
  };
  // const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">("en");
  const { translate } = useTranslation();

  const activeData = (key: string) => {
    return activeLanguageData(data, activeLanguage, key);
  };

  const isExpanded = collapse === formElement?.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <InputField
            label={
              (activeData("label") || translate("labelTextLabel")) +
              (data.required ? " *" : "")
            }
            placeholder={
              activeData("placeholder") || translate("labelTextPlaceholder")
            }
            value={""}
            onBlur={() => {}}
            onChange={() => {}}
            readOnly={true}
          />
        </FormElementPreviewContainer>
      )}
      {isExpanded && (
        <div className="p-4 space-y-6">
          <InputField
            label={translate("labelTextLabel")}
            placeholder={translate("placeHolderLabel")}
            // value={data[activeLanguage].label}
            value={activeData("label")}
            onBlur={(e) => updateData("label", e, true)}
            onChange={(e) => updateData("label", e, false)}
          />
          <InputField
            label={translate("labelTextPlaceholder")}
            placeholder={translate("placeHolderText")}
            value={activeData("placeholder")}
            onBlur={(e) => updateData("placeholder", e, true)}
            onChange={(e) => updateData("placeholder", e, false)}
          />

          <Dropdown
            label={translate("labelInputType")}
            options={options?.[locale]}
            value={data?.input_type}
            name=""
            onChange={(e) => {
              if (e.target.value === "string") {
                const updatedData = {
                  ...data,
                  min_value: "",
                  max_value: "",
                  input_type: e.target.value,
                };
                setData(updatedData);
                onChange(updatedData, true);
              } else {
                const updatedData = {
                  ...data,
                  min_length: "",
                  max_length: "",
                  input_type: e.target.value,
                };
                setData(updatedData);
                onChange(updatedData, true);
              }
            }}
          />

          <AdvancedOptionsWrapper>
            <div className="border-grey-300 border rounded-md p-4 space-y-4">
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
                    checked={data.enableValidation}
                    onChange={() => {
                      updateData("enableValidation", true, true);
                    }}
                  />
                  <span className="ml-2">
                    <FormattedMessage id="enableValidation"></FormattedMessage>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="validationToggle"
                    value="disable"
                    checked={!data.enableValidation}
                    onChange={() => {
                      updateData("enableValidation", false, true);
                    }}
                  />
                  <span className="ml-2">
                    <FormattedMessage id="disableValidation"></FormattedMessage>
                  </span>
                </label>
              </div>

              {data?.enableValidation && (
                <div className="space-y-4">
                  {data.input_type === "number" ||
                  data.input_type === "float" ? (
                    <>
                      <InputField
                        label={translate("minValue")}
                        placeholder={translate("minValuePlaceholder")}
                        value={data?.min_value}
                        onBlur={(e) => updateData("min_value", e, true)}
                        onChange={(e) => updateData("min_value", e, false)}
                        type="number"
                      />
                      <InputField
                        label={translate("maxValue")}
                        placeholder={translate("maxValuePlaceholder")}
                        value={data?.max_value}
                        onBlur={(e) => updateData("max_value", e, true)}
                        onChange={(e) => updateData("max_value", e, false)}
                        type="number"
                      />
                    </>
                  ) : (
                    <>
                      <InputField
                        label={translate("minLength")}
                        placeholder={translate("minLengthPlaceholder")}
                        value={data?.min_length}
                        onBlur={(e) => updateData("min_length", e, true)}
                        onChange={(e) => updateData("min_length", e, false)}
                        type="number"
                      />
                      <InputField
                        label={translate("maxLength")}
                        placeholder={translate("maxLengthPlaceholder")}
                        value={data?.max_length}
                        onBlur={(e) => updateData("max_length", e, true)}
                        onChange={(e) => updateData("max_length", e, false)}
                        type="number"
                      />
                    </>
                  )}

                  <InputField
                    label="Regular Expression"
                    placeholder="Enter regex pattern"
                    value={data?.regularExpression}
                    onBlur={(e) => updateData("regularExpression", e, true)}
                    onChange={(e) => updateData("regularExpression", e, false)}
                  />
                </div>
              )}
            </div>
          </AdvancedOptionsWrapper>

          {/* Checkboxes */}
          <div className="flex justify-between">
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

export default TextField;
