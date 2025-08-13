import { Add, Password } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import {
  fetchBranchesFilter,
  fetchCategoriesFilter,
  fetchDeparmentsFilter,
  fetchSectionDetailsFilter,
} from "../../../apis/administration";
import { createProcess, listLanguages } from "../../../apis/process";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import Dropdown from "../../../components/Dropdown/Dropdown";
import FileUpload from "../../../components/FormElements/components/FileUpload";
import InputField from "../../../components/FormElements/newcompnents/InputField";
import TranslationSummary from "../../../containers/summary/TranslationSummary";
import useTranslation from "../../../hooks/useTranslation";
import { postMethod, putMethod } from "../../../apis/ApiMethod";
import {
  CREATE_STAFF,
  GET_STAFF_ORGANIZATION,
  UPDATE_STAFF,
  WORK_FLOW_PROCESS,
} from "../../../apis/urls";
import { returnErrorToast } from "../../../utils/returnApiError";

type formDataCommon = {
  department: string;
  contact: string;
  email: string;
  branch: string;
  section: string;
  [key: string]: any; // Allow string indexing
};

function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
    reader.onerror = (error: any) => reject(error);
    reader.readAsDataURL(file); // Read the file as a data URL
  });
}

export function CreateOrEditUser({
  formDataProps = {},
  onClose,
  fetchList,
}: {
  formDataProps?: any;
  onClose?: () => void;
  fetchList?: () => any;
}) {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [departments, setDepartments] = useState<Array<any>>([]);
  const [branches, setBranches] = useState<Array<any>>([]);
  const [sections, setSections] = useState<Array<any>>([]);
  const [languages, setLanguages] = useState<Array<any>>([]);

  const { locale } = useIntl();
  // const [languagePreference] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(
    !Object.keys(formDataProps ?? {})?.length
  );
  const [formData, setFormData] = useState<Record<string, any>>(
    formDataProps?.translations
  );
  const [submitLoader, setSubmitLoader] = useState(false);
  const [formDataCommon, setFormDataCommon] = useState<formDataCommon>({
    email: formDataProps?.email,
    contact: formDataProps?.phone_number,
    department: formDataProps?.department ?? "",
    branch: formDataProps?.branch || "",
    section: formDataProps?.section || "",
  });

  console.log(formDataProps);

  const formik = useFormik<any>({
    initialValues: {
      language: locale,
      remarks: "",
      first_name: "",
      last_name: "",
      email: formDataCommon?.email,
      contact: formDataCommon?.contact,
      department: formDataCommon?.department,
      branch: formDataCommon?.branch,
      section: formDataCommon?.section,
      password: formDataCommon?.password,
      confirm_password: formDataCommon?.confirm_password,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required"),
      contact: Yup.string().required("Contact is required"),
      language: Yup.string().required("Language is required"),
      password: Yup.string().when([], {
        is: () => !formDataProps?.uuid,
        then: (schema) =>
          schema
            .required("Password is required")
            .min(8, "Password must be at least 8 characters"),
        otherwise: (schema) => schema.notRequired(),
      }),

      confirm_password: Yup.string().when("password", {
        is: (val: string) => val?.length > 0,
        then: (schema) =>
          schema
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Passwords must match"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      const reqBody = {
        first_name: values.first_name,
        last_name: values.last_name,
      };

      setFormDataCommon((state) => ({
        ...state,
        email: values.email,
        contact: values.contact,
        branch: values.branch,
        department: values.department,
        section: values.section,
        password: values.password,
        confirm_password: values.confirm_password,
      }));
      setFormData((state) => ({
        ...state,
        [values.language]: reqBody,
      }));
      setIsEdit(false);
    },
  });

  console.log(formik);

  const { translate } = useTranslation();

  useEffect(() => {
    getBranchList();
    getLanguages();
    getCategoriesList();
    if (formDataCommon?.branch) {
      getDepartmentList(formDataCommon?.branch);
    }
    // if (formDataCommon?.department) {
    //   getSectionList(formDataCommon?.department);
    // }
  }, []);

  const getDepartmentList = async (branchId: string) => {
    if (branchId) {
      try {
        const data = await fetchDeparmentsFilter(branchId);
        setDepartments(data.results);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getBranchList = async () => {
    try {
      const data = await fetchBranchesFilter();
      setBranches(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const getSectionList = async (departmentId: string) => {
    if (departmentId) {
      try {
        const data = await fetchSectionDetailsFilter(departmentId);
        setSections(data.results);
      } catch (error) {
        console.log("sections API", error);
      }
    }
  };

  const getCategoriesList = async () => {
    try {
      const data = await fetchCategoriesFilter();
      setCategories(data.results);
    } catch (error) {
      console.log(error);
    }
  };
  const getLanguages = async () => {
    try {
      const data = await listLanguages();
      setLanguages(data);
    } catch (error) {
      console.log(error);
    }
  };

  async function createProccess() {
    setSubmitLoader(true);

    const { confirm_password, ...rest } = formDataCommon;
    try {
      let reqBody: any = {
        ...rest,
        first_name: formData?.en?.first_name || "",
        last_name: formData?.en?.last_name || "",
        profile_img: file?.name
          ? { value: base64String, name: file?.name }
          : null,
        translations: formData,
        password: rest.password ? rest.password : undefined,
      };
      if (formDataProps) {
        reqBody.uuid = formDataProps?.uuid;
        await putMethod(UPDATE_STAFF + formDataProps?.uuid + "/", reqBody);
        fetchList && fetchList();
        onClose && onClose();
      } else {
        const res = await postMethod(CREATE_STAFF, reqBody);
        if (res) {
          fetchList && fetchList();
          onClose && onClose();
        }
      }
    } catch (error) {
      returnErrorToast({ error, locale });
    } finally {
      setSubmitLoader(false);
    }
  }

  const [file, setFile] = useState<any>(null);
  const [base64String, setBase64String] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      let base64 = await fileToBase64(file);
      setBase64String(base64);
    }
    setFile(file);
  };

  const [commonValues, setCommonValues] = useState({
    branch: "",
    department: "",
    section: "",
    password: "",
    confirm_password: "",
  });

  const handleCommonValue = (event: any) => {
    setCommonValues({
      ...commonValues,
      [event.target.name]: event.target.value,
    });
  };

  function closeDialog() {
    onClose && onClose();
  }

  return (
    <div className="flex items-center justify-center overflow-y-auto h-full">
      {/* <IntlProvider locale={formik.values?.language} messages={safeLocale}> */}
      <form className="h-full">
        <DialogCustomized
          title={translate(formDataProps ? "updateUser" : "createNewUser")}
          handleClose={closeDialog}
          content={
            !isEdit ? (
              <Stack spacing={1}>
                {Object.entries(formData || {}).map(([key, form]: any) => {
                  return (
                    <TranslationSummary
                      key={form.language}
                      language={
                        languages.find(
                          (lang) => lang.code === (form.language || key)
                        )?.name
                      }
                      handleEdit={() => {
                        formik.setValues({
                          language: form?.language ?? key ?? "",
                          first_name: form?.first_name ?? "",
                          last_name: form?.last_name ?? "",
                          email: formDataCommon?.email ?? "",
                          contact: formDataCommon?.contact ?? "",
                          branch: formDataCommon?.branch ?? "",
                          department: formDataCommon?.department ?? "",
                          section: formDataCommon?.section ?? "",
                        });
                        setIsEdit(true);
                      }}
                      keys={[
                        { label: "firstName", value: "first_name" },
                        { label: "lastName", value: "last_name" },
                        { label: "email", value: "emailLabel" },
                        { label: "contactNo", value: "phoneLabel" },
                        { label: "branch", value: "branchLabel" },
                        { label: "department", value: "deparmentLabel" },
                        { label: "section", value: "sectionLabel" },
                      ]}
                      languageConfig={{
                        ...form,
                        branchLabel: branches?.find(
                          (cat) => cat.uuid === formDataCommon?.branch
                        )?.translations?.[form?.language || key],
                        deparmentLabel: departments?.find(
                          (cat) => cat.uuid === formDataCommon?.department
                        )?.translations?.[form?.language || key]?.name,
                        sectionLabel: sections?.find(
                          (cat) => cat.uuid === formDataCommon?.section
                        )?.translations?.[form?.language || key],
                        emailLabel: formDataCommon?.email,
                        phoneLabel: formDataCommon?.contact,
                      }}
                    />
                  );
                })}

                <Stack alignItems="flex-start" mt={1}>
                  <FileUpload
                    value={file}
                    accept="image/*"
                    onChange={handleFileChange}
                    name="logoupload"
                    label={
                      <FormattedMessage id="profilePhoto"></FormattedMessage>
                    }
                  />
                </Stack>
                <Stack alignItems="flex-start">
                  <Button
                    startIcon={<Add />}
                    onClick={() => {
                      formik.resetForm();
                      formik.setValues({
                        language: "",
                        ...commonValues,
                      });
                      setIsEdit(true);
                    }}
                  >
                    <FormattedMessage id="additionalLanguage"></FormattedMessage>
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <div className="flex flex-col justify-between items-center h-full">
                <div style={{ width: "100%" }} className="flex flex-col gap-4">
                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      label={translate("language")}
                      name="language"
                      options={languages}
                      onChange={(e) => {
                        let initialValues = formData?.[e.target.value];

                        formik.setValues({
                          language: initialValues?.language ?? "",
                          firstName: initialValues?.firstName ?? "",
                          lastName: initialValues?.lastName ?? "",
                          ...commonValues,
                        });
                        formik.handleChange(e);
                      }}
                      labelKey="name"
                      valueKey="code"
                      value={formik.values.language}
                      error={
                        formik.touched.language &&
                        Boolean(formik.errors.language)
                      }
                      helperText={
                        formik.touched.language
                          ? (formik.errors.language as string)
                          : ""
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="first_name"
                      placeholder={translate("enterFirstName")}
                      label={<FormattedMessage id="firstName" />}
                      value={formik.values.first_name}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      onChange={(_, e: any) => formik.handleChange(e)}
                      error={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                      }
                      helperText={
                        formik.touched.first_name
                          ? (formik.errors.first_name as string)
                          : ""
                      }
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="last_name"
                      placeholder={translate("enterLastName")}
                      label={<FormattedMessage id="lastName" />}
                      value={formik.values.last_name}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      onChange={(_, e: any) => formik.handleChange(e)}
                      error={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                      }
                      helperText={
                        formik.touched.last_name
                          ? (formik.errors.last_name as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="email"
                      placeholder={translate("enterEmail")}
                      label={<FormattedMessage id="email" />}
                      value={formik.values.email}
                      // onChange={(_, e: any) => formik.handleChange(e)}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      onChange={(_, e) => {
                        formik.handleChange(e);
                        handleCommonValue(e);
                      }}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={
                        formik.touched.email
                          ? (formik.errors.email as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="contact"
                      placeholder={translate("enterContactNo")}
                      label={<FormattedMessage id="contactNo" />}
                      value={formik.values.contact}
                      // onChange={(_, e: any) => {
                      //   formik.handleChange(e);
                      // }}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      onChange={(_, e) => {
                        formik.handleChange(e);
                        handleCommonValue(e);
                      }}
                      error={
                        formik.touched.contact && Boolean(formik.errors.contact)
                      }
                      helperText={
                        formik.touched.contact
                          ? (formik.errors.contact as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      type="password"
                      name="password"
                      placeholder={translate("enterPassword")}
                      label={<FormattedMessage id="password" />}
                      value={formik.values.password}
                      // onChange={(_, e: any) => formik.handleChange(e)}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      onChange={(_, e) => {
                        formik.handleChange(e);
                        handleCommonValue(e);
                      }}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password
                          ? (formik.errors.password as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      type="password"
                      name="confirm_password"
                      placeholder={translate("enterConfirmPassword")}
                      label={<FormattedMessage id="confirmPassword" />}
                      value={formik.values.confirm_password}
                      onBlur={(_, e) => formik.handleBlur(e)}
                      // onChange={(_, e: any) => formik.handleChange(e)}
                      onChange={(_, e) => {
                        formik.handleChange(e);
                        handleCommonValue(e);
                      }}
                      error={
                        formik.touched.confirm_password &&
                        Boolean(formik.errors.confirm_password)
                      }
                      helperText={
                        formik.touched.confirm_password
                          ? (formik.errors.confirm_password as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      value={formik?.values?.branch}
                      label={<FormattedMessage id="submenuBranch" />}
                      name="branch"
                      onBlur={formik.handleBlur}
                      options={
                        branches?.map((item: any) => ({
                          label:
                            item?.translations?.[formik.values.language] ||
                            item.name,
                          value: item.uuid,
                        })) ?? []
                      }
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue("department", "");
                        formik.setFieldValue("section", "");
                        getDepartmentList(e.target.value);
                        handleCommonValue(e);
                      }}
                      // labelKey="name"
                      // valueKey="uuid"
                      error={
                        formik.touched.branch && Boolean(formik.errors.branch)
                      }
                      helperText={
                        formik.touched.branch
                          ? (formik.errors.branch as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      value={formik?.values?.department}
                      label={<FormattedMessage id="department" />}
                      name="department"
                      onBlur={formik.handleBlur}
                      options={
                        departments?.map((item: any) => ({
                          label:
                            item?.translations?.[formik.values.language]
                              ?.name || item?.name,
                          value: item.uuid,
                        })) ?? []
                      }
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue("section", "");
                        getSectionList(e.target.value);
                        handleCommonValue(e);
                      }}
                      // labelKey="name"
                      // valueKey="uuid"
                      error={
                        formik.touched.department &&
                        Boolean(formik.errors.department)
                      }
                      helperText={
                        formik.touched.department
                          ? (formik.errors.department as string)
                          : ""
                      }
                      disabled={!formik?.values?.branch}
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      value={formik?.values?.section}
                      label={<FormattedMessage id="section" />}
                      name="section"
                      onBlur={formik.handleBlur}
                      options={
                        sections?.map((item: any) => ({
                          label:
                            item?.translations?.[formik.values.language] ||
                            item.name,
                          value: item.uuid,
                        })) ?? []
                      }
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleCommonValue(e);
                      }}
                      error={
                        formik.touched.section && Boolean(formik.errors.section)
                      }
                      helperText={
                        formik.touched.section
                          ? (formik.errors.section as string)
                          : ""
                      }
                      disabled={!formik?.values?.department}
                    />
                  </div>
                </div>

                <Stack
                  justifyContent="flex-end"
                  width={"100%"}
                  alignItems="flex-end"
                  // onClick={() => formik.handleSubmit()}
                  paddingY={1}
                >
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    // onClick={() => formik.handleSubmit()}
                    onClick={() => formik.submitForm()}
                  >
                    <FormattedMessage id="continue" />
                  </Button>
                </Stack>
              </div>
            )
          }
          open={true}
          actions={
            !isEdit && (
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button
                  onClick={closeDialog}
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  size="small"
                  // type="submit"
                  variant="contained"
                  disableElevation
                  sx={{ textTransform: "none" }}
                  onClick={createProccess}
                  disabled={submitLoader}
                >
                  {translate(formDataProps ? "update" : "submitButton")}
                </Button>
              </Stack>
            )
          }
        />
      </form>
      {/* </IntlProvider> */}
    </div>
  );
}

export default CreateOrEditUser;
