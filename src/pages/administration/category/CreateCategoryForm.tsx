import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { CreateCategories } from "../../../apis/flowBuilder";
import { listLanguages } from "../../../apis/process";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import Dropdown from "../../../components/Dropdown/Dropdown";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import useTranslation from "../../../hooks/useTranslation";
import CreateCategorySummary from "./CreateCategorySummary";

const validationSchema = Yup.object({
  language: Yup.string().required("Language is required"),
  name: Yup.string().required("Category name is required"),
});

function CreateCategory({
  open,
  handleClose,
  onSucess,
}: {
  open: boolean;
  handleClose: () => void;
  onSucess: () => any;
}) {
  const [languages, setLanguages] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [isEdit, setIsEdit] = useState(true);
  const [submitLoader, setsubmitLoader] = useState(false);
  const { locale } = useIntl();
  const { translate: translateGlobal } = useTranslation();

  const formik = useFormik({
    initialValues: { language: locale, name: "", description: "", icon: "" },
    validationSchema,
    onSubmit: (values) => {
      setForm((state: any) => ({ ...state, [values.language]: values }));
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

  async function createCategory() {
    setsubmitLoader(true);
    try {
      const reqBody = {
        ...form.en,
        icon: formik?.values?.icon ?? {},
        is_active: false,
        created_by: 11,
        translations: form,
        code: "12",
      };
      await CreateCategories(reqBody);
      setIsEdit(false);
      onSucess();
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
      setsubmitLoader(false);
    }
  }

  return (
    <DialogCustomized
      open={open}
      handleClose={handleClose}
      title="Create Category"
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
          <CreateCategorySummary
            formData={form}
            setIsEdit={setIsEdit}
            formik={formik}
            languages={languages}
          />
        )
      }
      actions={
        !isEdit && (
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button size="small" onClick={handleClose}>
              {translateGlobal("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              size="small"
              onClick={createCategory}
              disabled={submitLoader}
            >
              {translateGlobal("newCategory")}
            </Button>
          </Stack>
        )
      }
    ></DialogCustomized>
  );
}

export default CreateCategory;
