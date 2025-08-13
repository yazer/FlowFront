import { FC, useState } from "react";
import useTranslation from "../../../hooks/useTranslation";
import CheckBox from "../components/CheckBox";
import { elements_type, languages } from "../constants";
import {
  activeLanguageData,
  updateTranslationData,
  updateTranslationOptions,
} from "../formTranslations";
import InputField from "./InputField";
import DependentPopup from "../components/dependentPopup";
import FormElementPreviewContainer from "../FormElementPreviewContainer";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { AddOutlined, Close } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

interface TextFieldInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (data: any, call_api?: boolean) => void;
  name?: string;
  required?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  activeLanguage?: any;
  formData: any;
}

const FormCheckBox: FC<TextFieldInterface> = ({
  collapse,
  formElement,
  onChange,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState({
    id: formElement?.id || "",
    label: formElement?.label || "",
    value: "",
    width: formElement?.width || undefined,
    element_type: elements_type.CHECKBOX,
    required: formElement?.required || false,
    hidden: false,
    readonly: false,
    show_all_stages: formElement?.show_all_stages || true,
    translate: languages.reduce((prev, next, ind) => {
      prev = {
        ...prev,
        [next]: { label: "", options: [] },
      };
      return prev;
    }, {}),
    dependentDetails: formElement?.dependentDetails || {
      parentId: "",
      condition: "",
      value: "",
    },
    enableDependent: formElement?.enableDependent || false,
    ...formElement,
  });

  // const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");
  const { translate } = useTranslation();

  // Update state and notify parent
  function updateData(name: string, value: any, call_api?: boolean) {
    let updatedData = updateTranslationData(
      data,
      name,
      elements_type.CHECKBOX,
      value,
      activeLanguage
    );

    setData(updatedData);
    onChange(updatedData, call_api);
  }

  function updateLocalizedField(fieldName: string, value: string) {
    updateData(fieldName, value, false);
  }

  const getActiveLanguageData = (fieldName: string) => {
    return activeLanguageData(data, activeLanguage, fieldName);
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

  const addInput = () => {
    const updatedData = updateTranslationOptions(
      data,
      activeLanguage,
      "add",
      0
    );
    setData(updatedData);
  };
  const isExpanded = collapse === formElement?.id;

  const Label = data?.translate?.[activeLanguage]?.label;
  const options = data.translate?.[activeLanguage]?.options?.length
    ? data.translate?.[activeLanguage]?.options
    : [[{ label: "", value: "" }]];
  return (
    <>
      <>
        {!isExpanded && (
          <FormElementPreviewContainer>
            {/* <CheckBox
              label={
                (getActiveLanguageData("label") ||
                  translate("labelTextLabel")) + (data.required ? " *" : "")
              }
              isChecked={true}
              onChange={(e: any) => {}}
            /> */}
            <Box className="py-2">
              <div className="flex flex-col gap-2">
                {options?.length ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      textTransform={"capitalize"}
                    >
                      {Label}
                    </Typography>
                    <Stack spacing={1}>
                      {options?.map((item: any, index: number) => {
                        return (
                          <Stack
                            direction="row"
                            alignItems="center"
                            key={index}
                          >
                            <input
                              value={item?.label}
                              id="checked-checkbox"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <Typography
                              variant="subtitle1"
                              textTransform={"capitalize"}
                              ml={1}
                            >
                              {(item.label || "Label") +
                                (data?.required ? " *" : "")}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </>
                ) : (
                  <Stack direction={"row"} alignItems={"center"}>
                    <input
                      // checked={formState?.[field.id]?.value ? true : false}
                      id="checked-checkbox"
                      type="checkbox"
                      // onChange={(e) => {
                      //   handleChange(field, e.target.checked);
                      // }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <Typography
                      variant="subtitle1"
                      textTransform={"capitalize"}
                      ml={1}
                    >
                      {(Label || "Label") + (data.required ? " *" : "")}
                    </Typography>
                  </Stack>
                )}
              </div>
            </Box>
          </FormElementPreviewContainer>
        )}

        {isExpanded && (
          <>
            <div className="p-4">
              <InputField
                label={translate("labelTextLabel")}
                placeholder={translate("placeHolderLabel")}
                value={getActiveLanguageData("label")}
                onChange={(value: string) =>
                  updateLocalizedField("label", value)
                }
                onBlur={(value) => updateData("label", value, true)}
              />
            </div>

            <div className="p-4">
              <CheckBox
                label={translate("Allow Multiple Selections")}
                isChecked={data.allow_multiple_selection}
                onChange={(e) =>
                  updateData("allow_multiple_selection", e.target.checked, true)
                }
              />
            </div>
            {/* Radio Button Options */}
            <div className="px-4">
              <Typography variant="h6">Options for Checkbox</Typography>
              {options?.map((x: { label: string }, ind: number) => (
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
              ))}
            </div>

            <Stack alignItems="flex-end" paddingX={2}>
              <Button
                type="button"
                onClick={addInput}
                startIcon={<AddOutlined />}
              >
                <FormattedMessage id="formBuilder.cta.addCheckbox" />
              </Button>
            </Stack>
            <div className="p-4">
              <DependentPopup
                data={data}
                formData={formData}
                onChange={updateData}
                activeLanguage={activeLanguage}
              />
            </div>

            <div className="flex pl-4 pr-4 pb-4 justify-between">
              <CheckBox
                label={translate("requiredErrorMessage")}
                isChecked={data.required}
                onChange={(e: any) =>
                  updateData("required", e.target.checked, true)
                }
              />
              <CheckBox
                label={translate("showAllStages")}
                isChecked={data.show_all_stages}
                onChange={(e) =>
                  updateData("show_all_stages", e.target.checked, true)
                }
              />
            </div>
          </>
        )}
      </>
    </>
  );
};

export default FormCheckBox;
