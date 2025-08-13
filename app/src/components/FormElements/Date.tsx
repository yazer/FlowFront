import { Dayjs } from "dayjs";
import { FC, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import CheckBox from "./components/CheckBox";
import DatePickerCustom from "./components/DatePicker";
import DependentPopup from "./components/dependentPopup";
import { elements_type } from "./constants";
import FormElementPreviewContainer from "./FormElementPreviewContainer";
import { activeLanguageData, updateTranslationData } from "./formTranslations";
import AdvancedOptionsWrapper from "./newcompnents/AdvancedOptionsWrapper";
import InputField from "./newcompnents/InputField";

interface DateInputInterface {
  formElement: any;
  collapse: any;
  onDelete: () => void;
  onChange: (data: any, api_call?: boolean) => void;
  label: string;
  activeLanguage: any;
  formData: any;
}

const DateInput: FC<DateInputInterface> = ({
  formElement,
  collapse,
  onChange,
  label,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState<{
    id: string;
    show_all_stages: boolean;
    enableValidation: boolean;
    start_date: any;
    end_date: any;
    required: boolean;
    label: string;
    element_type: string;
    dateValue?: Dayjs | null;
    width: string; // Specify Dayjs type for dateValue
    dependentDetails: any;
    enableDependent: boolean;
  }>({
    ...formElement,
    id: formElement?.id,
    show_all_stages: formElement?.show_all_stages || true,
    required: formElement?.required || false,
    element_type: elements_type.DATE,
    label,
    width: formElement?.width,
    dateValue: null,
    enableValidation: formElement?.enableValidation,
    start_date: formElement?.start_date,
    end_date: formElement?.end_date,
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
  });

  // const [activeLanguage, setActiveLanguage] = useState("en");
  const { translate } = useTranslation();

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.DATE,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, call_api);
  }

  function getCurrentLangData(key: string) {
    return activeLanguageData(data, activeLanguage, key);
  }

  const isExpanded = collapse === formElement.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <DatePickerCustom
            label={
              (getCurrentLangData("label") || translate("labelTextLabel")) +
              (data.required ? " *" : "")
            }
            value=""
            name=""
            onChange={() => {}}
          />
        </FormElementPreviewContainer>
      )}

      {isExpanded && (
        <div className="p-4">
          {/* <LangTab
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          /> */}
          {/* Label Input */}
          <InputField
            label={translate("label")}
            placeholder={translate("placeHolderLabel")}
            onChange={(value) => updateData("label", value)} // Send updated data on change
            onBlur={(value) => updateData("label", value, true)} // Send true on blur
            value={getCurrentLangData("label")}
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
                <span className="ml-2"> {translate("enableValidation")}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="validationToggle"
                  value="disable"
                  checked={!data?.enableValidation}
                  onChange={() => updateData("enableValidation", false, true)}
                />
                <span className="ml-2"> {translate("disableValidation")}</span>
              </label>
            </div>

            {data?.enableValidation && (
              <div className="space-y-4">
                <DatePickerCustom
                  label={translate("startDate")}
                  value={data?.start_date}
                  onChange={(e) =>
                    updateData("start_date", e.target.value, true)
                  }
                />
                <DatePickerCustom
                  label={translate("endDate")}
                  value={data?.end_date}
                  onChange={(e) => updateData("end_date", e.target.value, true)}
                />
              </div>
            )}
            {/* Date Picker */}
          </AdvancedOptionsWrapper>
          <div className="flex justify-between mt-4">
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

export default DateInput;
