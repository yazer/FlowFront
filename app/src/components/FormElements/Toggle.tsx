import { FormControlLabel, Switch, Typography } from "@mui/material";
import { FC, useState } from "react";
import useTranslation from "../../hooks/useTranslation";
import CheckBox from "./components/CheckBox";
import { elements_type } from "./constants";
import { activeLanguageData, updateTranslationData } from "./formTranslations";
import InputField from "./newcompnents/InputField";
import DependentPopup from "./components/dependentPopup";
import FormElementPreviewContainer from "./FormElementPreviewContainer";

interface ToggleInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  label: string;
  required?: boolean;
  defaultChecked?: boolean;
  onChange: (data: any, api_call: boolean) => void;
  activeLanguage: any;
  formData: any;
}
const Toggle: FC<ToggleInterface> = ({
  formElement,
  collapse,
  onDelete,
  label,
  onChange,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState<any>({
    id: formElement?.id,
    width: formElement?.width,
    label,
    element_type: elements_type.TOGGLE,
    show_all_stages: formElement?.show_all_stages || true,
    default_checked: formElement?.default_checked || false,
    translate: formElement?.translate || {},
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
  });
  // const [activeLanguage, setActiveLanguage] = useState<"en" | "ar" | string>(
  //   "en"
  // );
  const { translate } = useTranslation();

  function updateData(name: string, value: string | any, api_call = true) {
    let updatedData = { ...data };
    updatedData = updateTranslationData(
      data,
      name,
      elements_type.TOGGLE,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, api_call);
  }

  function getDataBasedOnLanguage(key: string) {
    // @ts-ignore
    return activeLanguageData(data, activeLanguage, key);
  }

  const isExpanded = collapse === formElement.id;

  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <FormControlLabel
            control={<Switch readOnly />}
            label={
              <Typography variant="subtitle1" textTransform={"capitalize"}>
                {getDataBasedOnLanguage("label") || "Label"}
              </Typography>
            }
            style={{
              textTransform: "capitalize",
              color: "#212121",
              fontSize: "12px",
              fontWeight: "600",
            }}
          />
        </FormElementPreviewContainer>
      )}
      {isExpanded && (
        <div className="p-4">
          {/* <LangTab
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          /> */}
          <InputField
            label={translate("labelTextLabel")}
            placeholder={translate("placeHolderLabel")}
            value={getDataBasedOnLanguage("label")}
            onChange={(value) => updateData("label", value, false)}
            onBlur={(value) => updateData("label", value, true)}
          />

          <DependentPopup
            data={data}
            formData={formData}
            onChange={updateData}
            activeLanguage={activeLanguage}
          />

          <div className="flex justify-between mt-4">
            <CheckBox
              label={translate("defaultChecked")}
              isChecked={data?.default_checked}
              onChange={(e) =>
                updateData("default_checked", e.target.checked, true)
              }
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

export default Toggle;
