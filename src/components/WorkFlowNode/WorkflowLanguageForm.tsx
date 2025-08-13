import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { listLanguages } from "../../apis/process";
import TranslationSummary from "../../containers/summary/TranslationSummary";
import useTranslation from "../../hooks/useTranslation";
import DirectionBasedOnLanguage from "../DirectionBasedOnLanguage";
import Dropdown from "../Dropdown/Dropdown";
import InputField from "../FormElements/newcompnents/InputField";

function WorkflowLanguageForm({
  formik,
  isEdit,
  setIsEdit,
  formData,
  setFormData,
}: {
  formik: any;
  isEdit: boolean;
  setIsEdit: any;
  formData: any;
  setFormData: any;
}) {
  const [languages, setLanguages] = useState([]);
  const { locale } = useIntl();

  const { translate } = useTranslation();
  const { translate: translateGlobal } = useTranslation();

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const data = await listLanguages();
        setLanguages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getLanguages();
  }, []);

  return (
    <>
      {!isEdit && (
        <Stack spacing={2}>
          {Object.entries(formData).map(([key, value]: any) => (
            // @ts-ignore
            // <IntlProvider locale={key} messages={translationMessage[key]}>
            <TranslationSummary
              handleEdit={() => {
                setIsEdit(true);
                formik.setValues(value);
                setFormData((state: any) => {
                  // @ts-ignore
                  delete state?.[key];
                  return state;
                });
              }}
              keys={[
                { label: "flowName", value: "name" },
                { label: "description", value: "description" },
              ]}
              language={key}
              languageConfig={value}
            />
            // </IntlProvider>
          ))}
          <Stack justifyItems="flex-start" direction="row">
            <Button
              onClick={() => {
                setIsEdit(true);
                formik.resetForm({});
                formik.setValues({ language: "", name: "", description: "" });
                // formik.setValues({ ...formik.values, language: "" });
              }}
              startIcon={<Add />}
            >
              {translateGlobal("additionalLanguage")}
            </Button>
          </Stack>
        </Stack>
      )}
      {isEdit && (
        <DirectionBasedOnLanguage language={locale}>
          <Stack
            spacing={2}
            // dir={formik.values.language === "ar" ? "rtl" : "ltr"}
          >
            <Dropdown
              name={"language"}
              onChange={(e) => formik.handleChange(e)}
              options={languages}
              labelKey="name"
              valueKey="code"
              value={formik.values.language}
              label={translate("language")}
              error={formik.touched.language && Boolean(formik.errors.language)}
              helperText={
                (formik.touched.language && formik.errors.language) || ""
              }
            />

            <InputField
              name={"name"}
              onChange={(_value, e) => formik.handleChange(e)}
              value={formik.values.name}
              label={translate("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={(formik.touched.name && formik.errors.name) || ""}
            />

            <InputField
              name={"description"}
              onChange={(_value, e) => formik.handleChange(e)}
              value={formik.values.description}
              label={translate("description")}
              //   placeHolder={translate("description")}
            />
            <Stack justifyContent={"flex-end"} direction={"row"}>
              <Button onClick={() => formik.handleSubmit()} startIcon={<Add />}>
                {translateGlobal("continue")}
              </Button>
            </Stack>
          </Stack>
        </DirectionBasedOnLanguage>
      )}
    </>
  );
}

export default WorkflowLanguageForm;
