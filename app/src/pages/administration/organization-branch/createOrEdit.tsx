import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { listLanguages } from "../../../apis/process";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import Dropdown from "../../../components/Dropdown/Dropdown";
import CheckBox from "../../../components/FormElements/components/CheckBox";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import TranslationSummary from "../../../containers/summary/TranslationSummary";
import useTranslation from "../../../hooks/useTranslation";
import { CreateBranch, UpdateBranch } from "../../../apis/administration";
import { CREATE_BRANCH } from "../../../apis/urls";
import { postMethod, putMethod } from "../../../apis/ApiMethod";
import { returnErrorToast } from "../../../utils/returnApiError";
import CreateButton from "../../../components/Permissions/CreateButton";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Branch name is required"),
});

function CreateOrEdit({
  open,
  handleClose,
  onSucess,
  handleOpen,
  initialData = null,
}: {
  open: boolean;
  handleClose: () => void;
  onSucess: () => any;
  handleOpen: () => void;
  initialData: any;
}) {
  const [languages, setLanguages] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [commonValues, setCommonValues] = useState<any>({});
  const [isEdit, setIsEdit] = useState(true);
  const [submitLoader, setsubmitLoader] = useState(false);
  const { locale } = useIntl();
  const { translate: translateGlobal } = useTranslation();

  useEffect(() => {
    setForm(initialData?.translations ?? {});
    setCommonValues(initialData ?? {});
    setIsEdit(!initialData);
  }, [initialData]);

  const formik = useFormik({
    initialValues: {
      language: locale,
      name: "",
      email: "",
      contact_no: "",
      is_active: true,
      is_default: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const req = {
        name: values?.name ?? "",
      };

      const commonValue = {
        email: values?.email ?? "",
        contact_no: values?.contact_no ?? "",
        is_active: values?.is_active ?? "",
        is_default: values?.is_default ?? "",
      };

      setForm((state: any) => ({
        ...state,
        [values.language]: req,
      }));
      setCommonValues(commonValue);
      setIsEdit(false);
    },
  });
  const { translate } = useTranslation();

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

  async function handleSubmit() {
    setsubmitLoader(true);
    try {
      const reqBody = {
        ...form.en,
        ...commonValues,
        translations: Object.fromEntries(
          Object.entries(form).map(([key, value]: any) => [
            key,
            value?.name ?? "",
          ])
        ),
      };

      if (initialData) {
        await putMethod(`${CREATE_BRANCH}` + initialData.uuid + "/", reqBody);
        toast.success("Successfully updated Branch");
      } else {
        await postMethod(CREATE_BRANCH, reqBody);
        toast.success("Successfully created Branch");
      }
      setIsEdit(true);
      onSucess();
      formik.resetForm();
      setForm({});
    } catch (e) {
      returnErrorToast({ error: e, locale });
    } finally {
      setsubmitLoader(false);
    }
  }

  return (
    <div>
      <CreateButton
        variant="contained"
        onClick={handleOpen}
      >
        <FormattedMessage id="createBranch" />
      </CreateButton>

      <DialogCustomized
        open={open}
        handleClose={() => {
          handleClose();
          formik.resetForm();
          setForm({});
        }}
        title={translate(initialData ? "editBranch" : "createBranch")}
        content={
          isEdit ? (
            // <IntlProvider locale={formik.values.language} messages={message}>

            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Dropdown
                  label={translate("language")}
                  name="language"
                  options={languages}
                  onChange={(e) => {
                    let initialValues = form?.[e.target.value];
                    formik.setValues({
                      language: initialValues?.language ?? "",
                      name: initialValues?.name ?? "",
                      email: commonValues?.email ?? "",
                      contact_no: commonValues?.contact_no ?? "",
                      is_active: commonValues?.is_active ?? true,
                      is_default: commonValues?.is_default ?? false,
                    });
                    formik.handleChange(e);
                  }}
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
                  helperText={(formik.touched.name && formik.errors.name) || ""}
                />
                <InputField
                  label={translate("email")}
                  name="email"
                  placeholder={translate("branchFormEmailPlaceholder")}
                  onChange={(_, e) => {
                    formik.handleChange(e);
                  }}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    (formik.touched.email && formik.errors.email) || ""
                  }
                />
                <InputField
                  label={translate("branchFormContactLabel")}
                  name="contact_no"
                  placeholder={translate("branchFormContactPlaceholder")}
                  onChange={(_, e) => formik.handleChange(e)}
                  value={formik.values.contact_no}
                  error={
                    formik.touched.contact_no &&
                    Boolean(formik.errors.contact_no)
                  }
                  helperText={
                    (formik.touched.contact_no && formik.errors.contact_no) ||
                    ""
                  }
                />
                <CheckBox
                  label={translate("is_active")}
                  isChecked={formik.values.is_active}
                  onChange={(e) =>
                    formik.setFieldValue("is_active", e.target.checked)
                  }
                />
                <CheckBox
                  label={translate("is_default")}
                  isChecked={formik.values.is_default}
                  onChange={(e) =>
                    formik.setFieldValue("is_default", e.target.checked)
                  }
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
              setIsEdit={setIsEdit}
              formik={formik}
              languages={languages}
              commonValues={commonValues}
            />
          )
        }
        actions={
          !isEdit && (
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                size="small"
                onClick={() => {
                  handleClose();
                  formik.resetForm();
                  setForm({});
                }}
              >
                {translateGlobal("cancel")}
              </Button>
              <Button
                variant="contained"
                disableElevation
                size="small"
                onClick={handleSubmit}
                disabled={submitLoader}
              >
                {translateGlobal(initialData?.uuid ? "update" : "submitButton")}
              </Button>
            </Stack>
          )
        }
      ></DialogCustomized>
    </div>
  );
}

export default CreateOrEdit;

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

  return (
    <Stack spacing={2}>
      {Object.entries(formData || {}).map(([key, form]: any) => {
        return (
          // <IntlProvider
          //   locale={form.language}
          //   messages={language[form.language]}
          // >
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
                email: commonValues.email,
                contact_no: commonValues.contact_no,
                is_active: commonValues.is_active,
                is_default: commonValues.is_default,
              });
              setIsEdit(true);
            }}
            keys={[
              { label: "name", value: "name" },
              { label: "branchFormEmailLabel", value: "email" },
              { label: "branchFormContactLabel", value: "contact_no" },
              { label: "is_active", value: "is_active" },
              { label: "is_default", value: "is_default" },
            ]}
            languageConfig={{
              name: form.name || form,
              email: commonValues?.email,
              contact_no: commonValues?.contact_no,
              is_active: String(commonValues?.is_active),
              is_default: String(commonValues?.is_default),
            }}
          />
          // </IntlProvider>
        );
      })}

      <Stack alignItems="flex-start" mt={1} gap={2}>
        {/* <FileUpload
          accept="image/*"
          onChange={handleFileChange}
          name="logoupload"
          label="Logo"
          value={file}
        /> */}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-start">
        <Button startIcon={<Add />} onClick={addAdditionalLanguage}>
          <FormattedMessage id="additionalLanguage"></FormattedMessage>
        </Button>
      </Stack>
    </Stack>
  );
}
