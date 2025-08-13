import Add from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { SetStateAction, useEffect, useState } from "react";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import { useParams } from "react-router";
import * as Yup from "yup";
import { CreateSection } from "../../../apis/administration";
import { listLanguages } from "../../../apis/process";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import Dropdown from "../../../components/Dropdown/Dropdown";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import TranslationSummary from "../../../containers/summary/TranslationSummary";
import useTranslation from "../../../hooks/useTranslation";
import { putMethod } from "../../../apis/ApiMethod";
import { CREATE_SECTION } from "../../../apis/urls";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Section name is required"),
});

function CreateOrEditSection({
  onSucess,
  value,
  fetchList,
  open,
  setOpen,
  setSelectedRow,
}: {
  onSucess: () => any;
  value?: any;
  selectedRow?: any;
  fetchList: () => void;
  setSelectedRow?: (value: SetStateAction<any>) => void;
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
}) {
  const [languages, setLanguages] = useState<any[]>([]);
  const [form, setForm] = useState<any>(value?.translations || {});
  const [isEdit, setIsEdit] = useState(!value.uuid);
  const [submitLoader, setsubmitLoader] = useState(false);
  const { locale } = useIntl();
  const { translate } = useTranslation();
  const { departmentId } = useParams();
  const formik = useFormik({
    initialValues: {
      language: locale,
      name: value?.name ?? "",
      description: value?.description ?? "",
    },
    validationSchema,
    onSubmit: (values) => {
      setForm((state: any) => ({ ...state, [values.language]: values }));
      setIsEdit(false);
    },
  });

  useEffect(() => {
    console.log("translation updated", value);
    if (value.translations) {
      setForm(value.translations);
      setIsEdit(false);
    }
  }, [value.translations]);

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

  async function onSubmit() {
    setsubmitLoader(true);
    try {
      const reqBody = {
        ...form[Object.keys(form)[0]], // Use the first language as base
        department: departmentId,
        is_active: false,
        translations: form,
      };

      if (value?.uuid) {
        await putMethod(`${CREATE_SECTION}${value.uuid}/update/`, reqBody);
      } else {
        await CreateSection(reqBody);
      }

      setIsEdit(false);
      onSucess();
      handleClose();
      fetchList();
    } catch (e) {
      console.error(e);
    } finally {
      setsubmitLoader(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
    setForm({});
    setIsEdit(true);
    setSelectedRow && setSelectedRow({});
    formik.resetForm();
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        onClick={() => setOpen(true)}
        startIcon={<Add />}
      >
        <FormattedMessage id="section.create" />
      </Button>
      <DialogCustomized
        open={open}
        handleClose={handleClose}
        title={translate("section.create")}
        maxWidth="sm"
        content={
          isEdit ? (
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
                    (formik.touched.language && formik.errors.language) || ""
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
                    (formik.touched.name && formik.errors.name)?.toString() ??
                    ""
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
            <>
              <FormSummary
                formData={form}
                languages={languages}
                formik={formik}
                setIsEdit={function (value: SetStateAction<boolean>): void {
                  setIsEdit(value);
                }}
                commonValues={{}}
              />
            </>
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
                onClick={onSubmit}
                disabled={submitLoader}
              >
                {translate("submit")}
              </Button>
            </Stack>
          )
        }
      ></DialogCustomized>
    </div>
  );
}

export default CreateOrEditSection;

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
  const { translate } = useTranslation();

  function addAdditionalLanguage() {
    formik.resetForm();
    formik.setValues({ language: "", ...commonValues });
    setIsEdit(true);
  }

  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }
  return (
    <Stack spacing={2}>
      {Object.entries(formData || {}).map(([key, form = {}]: any) => {
        return (
          <IntlProvider locale={key} messages={languages?.[key]}>
            <TranslationSummary
              key={key}
              language={
                languages?.find(
                  (lang: any) => lang.code === (form?.language || key)
                )?.name
              }
              handleEdit={() => {
                formik.setValues({
                  language: form?.language || key || "",
                  name: form?.name || form,
                  description: form?.description ?? "",
                });
                setIsEdit(true);
              }}
              keys={[
                { label: "name", value: "name" },
                { label: "description", value: "description" },
              ]}
              languageConfig={{
                name: form?.name || form,
                description: form?.description || "",
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
