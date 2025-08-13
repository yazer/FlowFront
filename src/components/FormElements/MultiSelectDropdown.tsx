import { AddOutlined, CloseOutlined } from "@mui/icons-material";
import { FC, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import CheckBox from "./components/CheckBox";
import MultiSelectField from "./components/MultiSelectDropdown";
import { elements_type } from "./constants";
import {
  updateTranslationData,
  updateTranslationOptions,
} from "./formTranslations";
import InputField from "./newcompnents/InputField";
import DependentPopup from "./components/dependentPopup";
import FormElementPreviewContainer from "./FormElementPreviewContainer";
import { Typography } from "@mui/material";

interface DropDownInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (value: any, call_api?: boolean) => void;
  ar: { label?: string; options: { value: string; label: string }[] };
  en: { label?: string; options: { value: string; label: string }[] };
  name?: string;
  activeLanguage: any;
  formData: any;
}

const MultiSelectDropdown: FC<DropDownInterface> = ({
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
    translate: any;
    dependentDetails: any;
    enableDependent: boolean;
  }>({
    id: formElement?.id || "",
    width: formElement?.width,
    element_type: elements_type.MULTISELECTDROPDOWN,
    label: formElement?.label || "",
    required: formElement?.required || false,
    show_all_stages: formElement?.show_all_stages || true,
    options: formElement?.options || [""],
    translate: {
      en: {
        options: [{ label: "" }],
      },
      ar: {
        options: [{ label: "" }],
      },
      ...formElement.translate,
    },
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent,
  });

  // const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");
  const { translate } = useTranslation();

  const addOption = () => {
    const updatedOptions = updateTranslationOptions(
      data,
      activeLanguage,
      "add",
      0,
      ""
    );
    setData(updatedOptions);
  };

  const removeOption = (index: number) => {
    const updatedOptions = updateTranslationOptions(
      data,
      activeLanguage,
      "delete",
      index,
      ""
    );
    setData(updatedOptions);
  };

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    // const updatedData = {
    //   ...data,
    //   [name]: value,
    // };
    // setData(updatedData);
    // onChange(updatedData, call_api);
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.MULTISELECTDROPDOWN,
      value,
      activeLanguage
    );
    setData(updatedData);
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

    setData(updatedData);
    onChange(updatedData, call_api);
  }

  function updateOptions(value: string, index: number, call_api?: boolean) {
    const updatedOptions = updateTranslationOptions(
      data,
      activeLanguage,
      "edit",
      index,
      value
    );
    setData(updatedOptions);
    onChange(updatedOptions, call_api);
  }

  const isExpanded = collapse === formElement?.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <MultiSelectField
            label={
              (data?.translate?.[activeLanguage]?.label ||
                translate("labelTextLabel")) + (data.required ? " *" : "")
            }
            options={
              data?.translate?.[activeLanguage]?.options?.map((x: any) => ({
                label: typeof x === "object" ? x.label : x,
                value: typeof x === "object" ? x.label : x,
              })) ?? []
            }
            name=""
            value={undefined}
            onChange={undefined}
            defaultValue={[]}
          />
        </FormElementPreviewContainer>
      )}
      {isExpanded && (
        <>
          {/* <LangTab
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          /> */}

          {/* Form Content */}
          <div className="p-4">
            <InputField
              label={translate("label")}
              value={data.translate?.[activeLanguage]?.label}
              placeholder={translate("label")}
              onChange={(value) => updateData("label", value)}
              onBlur={(value) => updateData("label", value, true)}
            />

            <DependentPopup
              data={data}
              formData={formData}
              onChange={updateCheckBox}
              activeLanguage={activeLanguage}
            />

            <div className="mt-4">
              <Typography variant="h6">
                {translate("optionsForDropdown")}
              </Typography>
              {data?.translate?.[activeLanguage]?.options?.map(
                (option: any, index: number) => (
                  <div className="flex flex-col mt-4 gap-y-2" key={index}>
                    <div className="flex flex-col md:flex-row gap-2 items-end jusify-center w-full">
                      <InputField
                        // label={`Option Label (${
                        //   activeLanguage === "en" ? "English" : "Arabic"
                        // })`}
                        // placeholder={`Label in ${
                        //   activeLanguage === "en" ? "English" : "Arabic"
                        // }`}
                        label={translate("optionLabel")}
                        placeholder={translate("optionLabelPlaceholder")}
                        value={option.label}
                        onChange={(value) => updateOptions(value, index)}
                        onBlur={(value) => updateOptions(value, index, true)}
                      />
                      {/* <InputField
                      label={`Option Value (${
                        activeLanguage === "en" ? "English" : "Arabic"
                      })`}
                      placeholder={`Value in ${
                        activeLanguage === "en" ? "English" : "Arabic"
                      }`}
                      label={`Option Value`}
                      placeholder={`Value`}
                      value={option.value}
                      onChange={(value) => handleChange(value, index, "value")}
                    /> */}

                      {index ===
                      data?.translate?.[activeLanguage]?.options?.length - 1 ? (
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
            </div>
          </div>
          <div className="flex pl-4 pr-4 pb-4 justify-between">
            <CheckBox
              label={translate("requiredErrorMessage")}
              isChecked={data?.required}
              onChange={(e: any) =>
                updateCheckBox("required", e.target.checked, true)
              }
            />
            <CheckBox
              label={translate("showAllStages")}
              isChecked={data?.show_all_stages}
              onChange={(e) =>
                updateCheckBox("show_all_stages", e.target.checked, true)
              }
            />
          </div>
        </>
      )}
    </>
  );
};

export default MultiSelectDropdown;
