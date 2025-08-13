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
import { fileToBase64 } from "../../../utils/constants";
import FileUpload from "../../../components/FormElements/components/FileUpload";
import { CREATE_CATEGORY } from "../../../apis/urls";
import { postMethod, putMethod } from "../../../apis/ApiMethod";
import { returnErrorToast } from "../../../utils/returnApiError";
import CreateButton from "../../../components/Permissions/CreateButton";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Category name is required"),
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
  const [file, setFile] = useState<File | null | undefined>(null);
  const [base64String, setBase64String] = useState<string | null>(null);

  const [isEdit, setIsEdit] = useState(true);
  const [submitLoader, setsubmitLoader] = useState(false);
  const { locale } = useIntl();
  const { translate: translateGlobal } = useTranslation();

  useEffect(() => {
    setForm(initialData?.translations ?? {});
    setIsEdit(!initialData);
  }, [initialData]);

  const formik = useFormik({
    initialValues: { language: locale, name: "", description: "", icon: "" },
    validationSchema,
    onSubmit: (values) => {
      const req = {
        name: values?.name ?? "",
        description: values?.description ?? "",
      };

      setForm((state: any) => ({
        ...state,
        [values.language]: req,
      }));
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
      let reqBody: any = {
        name: form?.en?.name || "",
        icon: file?.name ? { value: base64String, name: file?.name } : null,
        translations: form,
      };

      if (initialData) {
        await putMethod(CREATE_CATEGORY + initialData.uuid + "/", reqBody);
        toast.success(
          <FormattedMessage id="successUpdateCategory"></FormattedMessage>
        );
      } else {
        await postMethod(CREATE_CATEGORY, reqBody);
        toast.success(
          <FormattedMessage id="successCreateCategory"></FormattedMessage>
        );
      }
      setIsEdit(false);
      onSucess();
      handleClose();
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
      <CreateButton onClick={handleOpen}>
        <FormattedMessage id="newCategory" />
      </CreateButton>
      <DialogCustomized
        open={open}
        handleClose={() => {
          handleClose();
          formik.resetForm();
          setForm({});
        }}
        title={translate(initialData ? "editCategory" : "newCategory")}
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
                      description: initialValues?.description ?? "",
                      icon: formik.values.icon,
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
              setIsEdit={setIsEdit}
              formik={formik}
              languages={languages}
              file={file}
              setFile={setFile}
              setBase64String={setBase64String}
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
                {translateGlobal("submitButton")}
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
  file,
  setFile,
  setBase64String,
}: {
  formData: any;
  languages: any;
  formik: any;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  commonValues?: any;
  file: File | null | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | null | undefined>>;
  setBase64String: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  // const [file, setFile] = useState<any>({});

  function addAdditionalLanguage() {
    formik.resetForm();
    formik.setValues({ language: "", ...commonValues });
    setIsEdit(true);
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event?.target?.files?.[0];

    if (file) {
      let base64 = await fileToBase64(file);
      setBase64String(base64);
    }
    setFile(file);
  };

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
                description: form.description,
              });
              setIsEdit(true);
            }}
            keys={[
              { label: "name", value: "name" },
              { label: "description", value: "description" },
            ]}
            languageConfig={{
              name: form.name || form,
              description: form.description,
            }}
          />
          // </IntlProvider>
        );
      })}

      <Stack alignItems="flex-start" mt={1} gap={2}>
        <FileUpload
          accept="image/*"
          onChange={handleFileChange}
          name="logoupload"
          label="Logo"
          value={file}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-start">
        <Button startIcon={<Add />} onClick={addAdditionalLanguage}>
          Additional langage
        </Button>
      </Stack>
    </Stack>
  );
}
