import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import { useParams } from "react-router";
import * as Yup from "yup";
import { postMethod, putMethod } from "../../../apis/ApiMethod";
import { listLanguages } from "../../../apis/process";
import { DEPAARTMENT_ORG } from "../../../apis/urls";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import Dropdown from "../../../components/Dropdown/Dropdown";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import TranslationSummary from "../../../containers/summary/TranslationSummary";
import useTranslation from "../../../hooks/useTranslation";
import toast from "react-hot-toast";
import { returnErrorToast } from "../../../utils/returnApiError";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Category name is required"),
});

function CreateCategory({
  open,
  handleClose,
  onSucess,
  values,
}: {
  open: boolean;
  handleClose: () => void;
  onSucess: () => any;
  values: any;
}) {
  const [languages, setLanguages] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ ...values?.translations });
  const [isEdit, setIsEdit] = useState(!values?.uuid);
  const [submitLoader, setsubmitLoader] = useState(false);
  const { locale } = useIntl();
  const { translate } = useTranslation();
  const { branchId } = useParams();

  const formik = useFormik({
    initialValues: {
      language: locale,
      name: "",
      description: "",
      values,
    },
    validationSchema,
    onSubmit: (values) => {
      setForm((state: any) => ({ ...state, [values.language]: values }));
      setIsEdit(false);
    },
  });

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

  console.log(form, "form");

  async function createCategory() {
    setsubmitLoader(true);
    if (values?.uuid) {
      try {
        const reqBody = {
          translations: form,
          branch: branchId,
          is_active: true,
          name: form.en?.name || "",
        };
        await putMethod(`${DEPAARTMENT_ORG}${values?.uuid}/`, reqBody);
        toast.success(translate("department.successUpdate"));
        setIsEdit(false);
        onSucess();
        handleClose();
      } catch (e: any) {
        console.log("department error", e);
        returnErrorToast({ error: e, locale });
      } finally {
        setsubmitLoader(false);
      }
    } else {
      try {
        const reqBody = {
          translations: form,
          branch: branchId,
          is_active: true,
          name: form.en?.name || "",
        };
        await postMethod(DEPAARTMENT_ORG, reqBody);
        toast.success(translate("department.successCreate"));
        setIsEdit(false);
        onSucess();
        handleClose();
      } catch (e: any) {
        console.log("department error", e);
        returnErrorToast({ error: e, locale });
      } finally {
        setsubmitLoader(false);
      }
    }
  }

  return (
    <DialogCustomized
      open={open}
      handleClose={handleClose}
      title={translate("newDepartment")}
      content={
        isEdit ? (
          // <IntlProvider locale={formik.values.language} messages={message}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <Dropdown
                label={translate("language")}
                name="language"
                options={languages}
                onChange={(e) => formik.handleChange(e)}
                labelKey="name"
                valueKey="code"
                value={formik.values.language}
                error={
                  formik.touched.language && Boolean(formik.errors.language)
                }
                helperText={
                  (
                    formik.touched?.language && formik.errors?.language
                  )?.toString() ?? ""
                }
              />

              <InputField
                label={translate("name")}
                name="name"
                placeholder={translate("enterName")}
                onChange={(_, e) => formik.handleChange(e)}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  (formik.touched.name && formik.errors.name)?.toString() || ""
                }
              />

              <InputField
                label={translate("description")}
                name="description"
                placeholder={translate("enterDescription")}
                onChange={(_, e) => formik.handleChange(e)}
                value={formik.values.description}
              />

              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" startIcon={<Add />}>
                  <FormattedMessage id="continue" />
                </Button>
              </Stack>
            </Stack>
          </form>
        ) : (
          // </IntlProvider>
          <FormSummary
            formData={form}
            languages={languages}
            formik={formik}
            setIsEdit={setIsEdit}
            commonValues={{}}
          />
        )
      }
      actions={
        !isEdit && (
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button size="small" onClick={handleClose}>
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              size="small"
              onClick={createCategory}
              disabled={submitLoader}
            >
              {values.uuid ? translate("update") : translate("submitButton")}
            </Button>
          </Stack>
        )
      }
    ></DialogCustomized>
  );
}

export default CreateCategory;

function FormSummary({
  formData,
  languages,
  formik,
  setIsEdit,
  commonValues,
}: {
  formData: any;
  languages: any;
  formik: any;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  commonValues: any;
}) {
  function addAdditionalLanguage() {
    formik.resetForm();
    formik.setValues({ language: "", ...commonValues });
    setIsEdit(true);
  }
  const { translate } = useTranslation();

  return (
    <Stack spacing={2}>
      {Object.entries(formData || {}).map(([key, form]: any) => {
        return (
          <IntlProvider
            locale={form.language}
            messages={languages[form.language]}
          >
            <TranslationSummary
              key={key}
              language={
                languages.find(
                  (lang: any) => lang.code === (form.language || key)
                )?.name
              }
              handleEdit={() => {
                formik.setValues({
                  language: form.language ?? key ?? "",
                  name: form.name || form,
                  description: form.description ?? "",
                });
                setIsEdit(true);
              }}
              keys={[
                { label: "name", value: "name" },
                { label: "description", value: "description" },
              ]}
              languageConfig={{
                name: form.name || form,
                description: form.description || "",
              }}
            />
          </IntlProvider>
        );
      })}

      <Stack direction="row" alignItems="center" justifyContent="flex-start">
        <Button startIcon={<Add />} onClick={addAdditionalLanguage}>
          {translate("additionalLanguage")}
        </Button>
      </Stack>
    </Stack>
  );
}
