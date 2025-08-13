import React, { useState, FC, useEffect } from "react";
import { Formik, Form, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import { Box, Grid, Button, Typography, Paper } from "@mui/material";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import { useIntl } from "react-intl";

interface OrganizationFormValues {
  name: string;
  primaryAddress: string;
  organizationType: string;
  industry: string;
  logo: File | null | string;
  cover_image: File | null | string;
  logoUrl?: string;
  coverPhotoUrl?: string;
}

interface OrganizationRegistrationFormProps {
  initialValues?: Partial<OrganizationFormValues>;
  onSubmit: (
    values: OrganizationFormValues,
    formData: FormData
  ) => Promise<void>;
}

interface FileUploadFieldProps {
  name: string;
  label: string;
  formik: FormikProps<OrganizationFormValues>;
  accept?: string;
  existingImageUrl?: string;
}

interface SelectFieldProps {
  label: string;
  name: keyof OrganizationFormValues;
  options: { value: string; label: string }[];
  formik: FormikProps<OrganizationFormValues>;
}

const organizationTypes = [
  { value: "corporation", label: "Corporation" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "partnership", label: "Partnership" },
  { value: "nonprofit", label: "Non-profit Organization" },
  { value: "soleProprietorship", label: "Sole Proprietorship" },
];

const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "entertainment", label: "Entertainment" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

const FileUploadField: FC<FileUploadFieldProps> = ({
  name,
  label,
  formik,
  accept = "image/*",
  existingImageUrl,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    existingImageUrl
  );

  // Update preview URL when existingImageUrl changes
  useEffect(() => {
    setPreviewUrl(existingImageUrl);
  }, [existingImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);

      // Create preview URL for the selected file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);

      // Update formik state
      formik.setFieldValue(name, file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(undefined);
    setFileName("");
    formik.setFieldValue(name, null);
  };

  return (
    <div className="w-full mb-4">
      <Typography variant="subtitle1" textTransform={"capitalize"} mb={1}>
        {label}
      </Typography>

      {previewUrl ? (
        <div className="relative border rounded-lg p-2 mb-2">
          <img
            src={previewUrl}
            alt={`${label} preview`}
            className="w-full h-32 object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-gray-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
          >
            ✕
          </button>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => document.getElementById(`${name}-input`)?.click()}
              className="text-blue-500 text-sm underline"
            >
              Change {label}
            </button>
          </div>
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => document.getElementById(`${name}-input`)?.click()}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500">
              {fileName || "SVG, PNG, JPG or GIF"}
            </p>
          </div>
        </label>
      )}

      <input
        id={`${name}-input`}
        name={name}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {formik.touched[name as keyof OrganizationFormValues] &&
        formik.errors[name as keyof OrganizationFormValues] && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors[name as keyof OrganizationFormValues] as string}
          </div>
        )}
    </div>
  );
};

const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  options,
  formik,
}) => {
  return (
    <div className="w-full">
      <Typography variant="subtitle1" textTransform={"capitalize"} mb={1}>
        {label}
      </Typography>
      <select
        name={name}
        value={formik?.values?.[name] as string}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline ${
          formik.touched[name] && formik.errors[name] ? "border-red-500" : ""
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm">
          {formik.errors[name] as string}
        </div>
      )}
    </div>
  );
};

// Define the validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Organization name is required"),
  primaryAddress: Yup.string().required("Primary address is required"),
  organizationType: Yup.string().required("Organization type is required"),
  industry: Yup.string().required("Industry is required"),
  // logo: Yup.mixed<File | string>().test(
  //   "file-or-url",
  //   "Logo is required",
  //   function (value) {
  //     return typeof value === "string" || value instanceof File;
  //   }
  // ),
  // coverPhoto: Yup.mixed<File | string>().test(
  //   "file-or-url",
  //   "Cover photo is required",
  //   function (value) {
  //     return typeof value === "string" || value instanceof File;
  //   }
  // ),
});

const BasicInformationForm: FC<OrganizationRegistrationFormProps> = ({
  initialValues = {},
  onSubmit,
}) => {
  const { locale } = useIntl();
  const defaultValues: OrganizationFormValues = {
    name: "",
    primaryAddress: "",
    organizationType: "",
    industry: "",
    logo: null,
    cover_image: null,
    logoUrl: "",
    coverPhotoUrl: "",
  };

  // Merge provided initial values with default values
  const formInitialValues = { ...defaultValues, ...initialValues };

  const handleSubmit = async (
    values: OrganizationFormValues,
    { setSubmitting }: FormikHelpers<OrganizationFormValues>
  ) => {
    try {
      // Create a FormData object for file uploads
      const formData = new FormData();
      formData.append("name", JSON.stringify({ [locale]: values.name }));
      formData.append("primaryAddress", JSON.stringify({ [locale]: values.primaryAddress }));
      formData.append("organizationType", JSON.stringify({ [locale]: values.organizationType }));
      formData.append("industry", JSON.stringify({ [locale]: values.industry }));
      if (values.logo) {
        formData.append("logo", values.logo);
      }
      if (values.cover_image) {
        formData.append("cover_image", values.cover_image);
      }
      await onSubmit(values, formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputField
                  label="Organization Name"
                  name="name"
                  value={formik.values.name}
                  onChange={(value) => formik.setFieldValue("name", value)}
                  onBlur={(value) => formik.setFieldTouched("name", true)}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={
                    formik.touched.name && formik.errors.name
                      ? formik.errors.name
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  label="Primary Address"
                  name="primaryAddress"
                  value={formik.values.primaryAddress}
                  onChange={(value) =>
                    formik.setFieldValue("primaryAddress", value)
                  }
                  onBlur={(value) =>
                    formik.setFieldTouched("primaryAddress", true)
                  }
                  error={
                    formik.touched.primaryAddress &&
                    Boolean(formik.errors.primaryAddress)
                  }
                  helperText={
                    formik.touched.primaryAddress &&
                    formik.errors.primaryAddress
                      ? formik.errors.primaryAddress
                      : ""
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SelectField
                  label="Organization Type"
                  name="organizationType"
                  options={organizationTypes}
                  formik={formik}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SelectField
                  label="Industry"
                  name="industry"
                  options={industryOptions}
                  formik={formik}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FileUploadField
                  name="logo"
                  label="Logo"
                  formik={formik}
                  existingImageUrl={formik.values.logoUrl}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FileUploadField
                  name="cover_image"
                  label="Cover Photo"
                  formik={formik}
                  existingImageUrl={formik.values.coverPhotoUrl}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formik.isSubmitting}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  {formik.isSubmitting
                    ? "Submitting..."
                    : "Update Basic Information"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default BasicInformationForm;
