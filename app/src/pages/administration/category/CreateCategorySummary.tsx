import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useState } from "react";
import FileUpload from "../../../components/FormElements/components/FileUpload";
import TranslationSummary from "../../../containers/summary/TranslationSummary";

function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
    reader.onerror = (error: any) => reject(error);
    reader.readAsDataURL(file); // Read the file as a data URL
  });
}

function CreateCategorySummary({
  formData,
  languages,
  formik,
  setIsEdit,
}: {
  formData: any;
  languages: any;
  formik: any;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [file, setFile] = useState<any>({});

  function addAdditionalLanguage() {
    formik.resetForm();
    formik.setValues({ language: "" });
    setIsEdit(true);
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      let base64 = await fileToBase64(file);
      formik.setFieldValue("icon", {
        value: base64,
        name: file.name,
      } as any);
    }
    setFile(file);
  };
  return (
    <Stack spacing={2}>
      {Object.values(formData).map((form: any) => {
        return (
          // <IntlProvider
          //   locale={form.language}
          //   messages={language[form.language]}
          // >
          <TranslationSummary
            key={form.language}
            language={
              languages.find((lang: any) => lang.code === form.language)?.name
            }
            handleEdit={() => {
              formik.setValues({
                language: form.language,
                name: form.name,
                code: form.code,
                description: form.description,
                remarks: form.remarks,
                category: form.category,
              });
              setIsEdit(true);
            }}
            keys={[
              { label: "name", value: "name" },
              { label: "description", value: "description" },
            ]}
            languageConfig={{
              ...form,
            }}
          />
          // </IntlProvider>
        );
      })}

      <Stack alignItems="flex-start" mt={1}>
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

export default CreateCategorySummary;
