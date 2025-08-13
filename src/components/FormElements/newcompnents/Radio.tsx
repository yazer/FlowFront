/* eslint-disable react-hooks/exhaustive-deps */
import Close from "@mui/icons-material/Close";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { FC, useEffect, useState } from "react";
import useTranslation, {
  translationMessage,
} from "../../../hooks/useTranslation";
// import { PreviewElements } from "../../FormPreview/FormPreview";
import CheckBox from "../components/CheckBox";
import { elements_type } from "../constants";
import {
  activeLanguageData,
  updateTranslationData,
  updateTranslationOptions,
} from "../formTranslations";
import InputField from "./InputField";
import { IntlProvider } from "react-intl";
import DependentPopup from "../components/dependentPopup";
import FormElementPreviewContainer from "../FormElementPreviewContainer";
import {
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import FormLabel from "../components/FormLabel";

interface RadioInterface {
  onDelete: () => void;
  onChange: (data: any, api?: boolean) => void;
  onBlur?: (value: string) => void;
  label: string;
  options?: { label: { en: string; ar: string }; value: string }[];
  activeLanguage: any;
  formElement: any;
  collapse: any;
  formData: any;
}

const RadioButton: FC<RadioInterface> = ({
  formElement,
  label,
  onChange,
  activeLanguage,
  collapse,
  formData,
}) => {
  const [data, setData] = useState({
    ...formElement,
    label: { en: label, ar: "" },
    element_type: elements_type.RADIOBUTTON,
    translate: formElement?.translate || {
      en: { label: "", options: [{ label: "", value: "" }] },
      ar: { label: "", options: [{ label: "", value: "" }] },
    },
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
    show_all_stages: formElement.show_all_stages || true,
  });
  const { translate } = useTranslation();

  const addInput = () => {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "add",
      0
    );
    setData(updatedData);
  };

  function onClickDropDown(ind: number, value: string, api_call?: boolean) {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "edit",
      ind,
      value
    );
    setData(updatedData);
    onChange(updatedData, api_call);
  }

  const updateData = (label: any, value: any, apiCall: boolean = false) => {
    const updatedData = updateTranslationData(
      data,
      label,
      elements_type.RADIOBUTTON,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, apiCall);
  };

  useEffect(() => {
    onChange(data);
  }, [data]);

  function getCurrentLanguageData(key: string) {
    return activeLanguageData(data, activeLanguage, key);
  }

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

  const isExpanded = collapse === formElement?.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <IntlProvider locale={activeLanguage} messages={translationMessage}>
            <FormLabel label={getCurrentLanguageData("label")}></FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={""}
            >
              {getCurrentLanguageData("options")?.map((element: any) => (
                <FormControlLabel
                  key={element.label}
                  control={<Radio />}
                  label={element.label}
                  value={element.label}
                />
              ))}
            </RadioGroup>
            {/* <DynamicForm field={data} index={0} /> */}
          </IntlProvider>
        </FormElementPreviewContainer>
      )}

      {isExpanded && (
        <div className="border-[1px] rounded">
          <div className="p-4">
            {/* Label Input */}
            <InputField
              label="label"
              value={getCurrentLanguageData("label")}
              placeholder={`Label (${activeLanguage.toUpperCase()})`}
              onChange={(value) => updateData("label", value)}
              onBlur={(value) => updateData("label", value, true)}
            />

            <DependentPopup
              data={data}
              formData={formData}
              onChange={updateData}
              activeLanguage={activeLanguage}
            />

            {/* Radio Button Options */}
            <div className="mt-2">
              <Typography variant="h6">Options for Radio Button</Typography>
              {data.translate?.[activeLanguage]?.options?.map(
                (x: { label: string }, ind: number) => (
                  <div
                    className="flex justify-between mt-2 gap-x-1 items-end"
                    key={ind}
                  >
                    {/* Option Label Input */}
                    <InputField
                      label="label"
                      placeholder={`Option Label (${activeLanguage.toUpperCase()})`}
                      value={x.label}
                      onChange={(value) => onClickDropDown(ind, value, false)}
                      onBlur={(value) => onClickDropDown(ind, value, true)}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeOption(ind)}
                      disabled={
                        data.translate?.[activeLanguage]?.options?.length <= 1
                      }
                    >
                      <Close />
                    </IconButton>
                  </div>
                )
              )}
            </div>
            {/* Add New Input Button */}
            <Stack alignItems="flex-end">
              <Button
                type="button"
                onClick={addInput}
                startIcon={<AddOutlined />}
              >
                Add Radio
              </Button>
            </Stack>
            <div className="flex justify-between mt-4">
              <CheckBox
                label={translate("requiredErrorMessage")}
                isChecked={data?.required}
                onChange={(e: any) =>
                  updateData("required", e.target.checked, true)
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
        </div>
      )}
    </>
  );
};

export default RadioButton;
