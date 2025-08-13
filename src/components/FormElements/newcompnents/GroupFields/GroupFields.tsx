import { Typography } from "@mui/material";
import { FC, useState } from "react";
import { useIntl } from "react-intl";
import useTranslation from "../../../../hooks/useTranslation";
import DynamicFormPopup from "../../../Modal/DynamicForm";
import { elements_type } from "../../constants";
import {
  activeLanguageData,
  updateTranslationData,
} from "../../formTranslations";
import InputField from "../InputField";
import FormEditorGrouping from "./FormEditorGrouping";

interface TextFieldInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (value: any, call_api?: boolean) => void;
  ar: any;
  en: any;
  name?: string;
  validation?: any;
  formContainerWidth: number;
  parentData?: any;
  updateParentData?: any;
  activeLanguage?: any;
  index: number;
}

const GroupFields: FC<TextFieldInterface> = ({
  collapse,
  onChange,
  formElement,
  formContainerWidth,
  parentData,
  updateParentData,
  activeLanguage,
  index,
}) => {
  const [data, setData] = useState({
    id: formElement?.id || "",
    title: formElement.title || "",
    element_type: elements_type.GROUPFIELDS,
    fields: formElement?.fields ?? [],
    width: formElement?.width,
    translate: formElement.translate || {},
  });
  // const [activeLanguage, setActiveLanguage] = useState("en");
  const { locale } = useIntl();
  const { translate } = useTranslation();

  // useEffect(() => {
  //   setData({
  //     id: formElement?.id || "",
  //     title: formElement.title || "",
  //     element_type: elements_type.GROUPFIELDS,
  //     fields: formElement?.fields ?? [],
  //     width: 100,
  //     translation: {},
  //   });
  // }, [parentData]);

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    // const updatedData = {
    //   ...data,
    //   [name]: value,
    // };
    const updatedData = updateTranslationData(
      data,
      name,
      elements_type.GROUPFIELDS,
      value,
      locale
    );
    setData(updatedData);
    onChange(updatedData, call_api);
  }

  const updateField = (value: any, api_call: boolean = false) => {
    setData({ ...data, fields: value });
    onChange({ ...data, fields: value }, api_call);
  };

  function getActiveLanguageData(key: string) {
    return activeLanguageData(data, locale, key);
  }

  const isExpanded = collapse === formElement?.id;
  return (
    <>
      {/* Preview (always visible) */}
      {!isExpanded && (
        <div className="p-4 bg-gray-50">
          {/* <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3> */}
          {/* <div
          style={{
            border: "1px solid #dfdfdf",
            padding: 12,
            borderRadius: "10px",
          }}
        >
          <Typography
            textAlign="center"
            variant="h3"
            sx={{
              fontSize: "18px",
              color: "#000",
              marginBottom: "16px",
              width: "100%",
            }}
          >
            {data?.title || ""}
          </Typography> */}
          {data.fields.length > 0 ? (
            <DynamicFormPopup
              formData={[data]}
              onSubmit={() => {}}
              isPreview={true}
              actionList={[]}
              previewActiveLang={activeLanguage}
              noSubmit={true}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "20px",
                color: "#555",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                margin: "20px 0",
              }}
            >
              <Typography variant="h6" textAlign="center" color="textSecondary">
                No fields have been added to this form group.
              </Typography>
            </div>
          )}
        </div>
      )}
      {/* </div> */}
      {isExpanded && (
        <>
          {/* <LangTab
            activeLanguage={activeLanguage}
            setActiveLanguage={setActiveLanguage}
          /> */}
          <div className="p-4 space-y-6">
            <InputField
              label={translate("formGroupTitle")}
              placeholder={translate("formGroupTitle")}
              // value={data[activeLanguage].placeholder}
              value={getActiveLanguageData("title")}
              onBlur={(e) => updateData("title", e, true)}
              onChange={(e) => updateData("title", e, false)}
            />
          </div>

          <FormEditorGrouping
            index={index}
            currentElement={data}
            formData={data?.fields}
            updateFormData={updateField}
            formContainerWidth={formContainerWidth}
            updateParentData={updateParentData}
            parentData={parentData}
            activeLanguage={activeLanguage}
          />
        </>
      )}
    </>
  );
};

export default GroupFields;
