import { Add } from "@mui/icons-material";
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
import { WORK_FLOW_PROCESS } from "../../../apis/urls";
import { returnErrorToast } from "../../../utils/returnApiError";

type formDataCommon = {
  department: string;
  description: string;
  branch: string;
  section: string;
  category: string;
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

export function ProcessCreate({
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
  const [isEdit, setIsEdit] = useState(!Object.keys(formDataProps).length);
  const [formData, setFormData] = useState<Record<string, any>>(
    formDataProps?.translations
  );
  const [submitLoader, setSubmitLoader] = useState(false);
  const [formDataCommon, setFormDataCommon] = useState<formDataCommon>({
    department: formDataProps.department ?? "",
    description: formDataProps.description || "",
    branch: formDataProps.branch || "",
    section: formDataProps.section || "",
    category: formDataProps.category || { [locale]: {} },
  });

  const formik = useFormik<any>({
    initialValues: {
      language: locale,
      name: "",
      code: "",
      description: "",
      remarks: "",
      category: formDataCommon?.category,
      descriptionAr: "",
      nameAr: "",
      remarksAr: "",
      descriptionSp: "",
      nameSp: "",
      remarksSp: "",
      department: formDataCommon?.department,
      branch: formDataCommon?.branch,
      section: formDataCommon?.section,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      language: Yup.string().required("Language is required"),
      category: Yup.string().required("Category is required"),
      department: Yup.string().required("Department is required"),
      branch: Yup.string().required("Branch is required"),
      section: Yup.string().required("Section is required"),
    }),
    onSubmit: async (values) => {
      const reqBody = {
        name: values.name,
        description: values.description,
        remarks: values.remarks,
        code: values.code,
        created_by: 1,
      };

      setFormDataCommon((state) => ({
        ...state,
        department: values.department,
        description: values.description,
        branch: values.branch,
        section: values.section,
        category: values.category,
      }));
      setFormData((state) => ({
        ...state,
        [values.language]: reqBody,
      }));
      setIsEdit(false);
    },
  });

  const { translate } = useTranslation();

  useEffect(() => {
    getBranchList();
    getLanguages();
    getCategoriesList();
    if (formDataCommon?.branch) {
      getDepartmentList(formDataCommon?.branch);
    }
    if (formDataCommon?.department) {
      getSectionList(formDataCommon?.department);
    }
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
    try {
      let reqBody: any = {
        ...formDataCommon,
        name: formData?.en?.name || "",
        icon: file?.name ? { value: base64String, name: file?.name } : null,
        translations: formData,
      };
      if (formDataProps?.uuid) {
        reqBody.uuid = formDataProps?.uuid;
        await putMethod(WORK_FLOW_PROCESS + formDataProps.uuid + "/", reqBody);
        fetchList && fetchList();
        onClose && onClose();
      } else {
        const res = await postMethod(WORK_FLOW_PROCESS, reqBody);
        if (res) {
          fetchList && fetchList();
          navigate(`/process-list-v2/flow-builder/${res.uuid}`);
        }
      }
    } catch (e) {
      returnErrorToast({ error: e, locale });
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

  const [cascadingValue, setCascadingValues] = useState({
    branch: "",
    department: "",
    section: "",
  });

  const handleCascadingDropdowns = (event: any) => {
    setCascadingValues({
      ...cascadingValue,
      [event.target.name]: event.target.value,
    });
  };

  function closeDialog() {
    navigate("/process-list-v2");
    onClose && onClose();
  }

  return (
    <div className="flex items-center justify-center overflow-y-auto h-full">
      {/* <IntlProvider locale={formik.values?.language} messages={safeLocale}> */}
      <form onSubmit={formik.handleSubmit} className="h-full">
        <DialogCustomized
          title={translate(
            formDataProps.uuid ? "updateProcess" : "createNewProcess"
          )}
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
                          name: form?.name ?? "",
                          description: form?.description ?? "",
                          remarks: form?.remarks ?? "",
                          category: formDataCommon?.category ?? "",
                          department: formDataCommon?.department ?? "",
                          branch: formDataCommon?.branch ?? "",
                          section: formDataCommon?.section ?? "",
                        });
                        setIsEdit(true);
                      }}
                      keys={[
                        { label: "name", value: "name" },
                        { label: "category", value: "categoryLabel" },
                        { label: "description", value: "description" },
                        { label: "remarks", value: "remarks" },
                        { label: "branch", value: "branchLabel" },
                        { label: "department", value: "deparmentLabel" },
                        { label: "section", value: "sectionLabel" },
                      ]}
                      languageConfig={{
                        ...form,
                        categoryLabel:
                          categories.find(
                            (cat) => cat.uuid === formDataCommon?.category
                          )?.translations[form?.language || key]?.category ??
                          "",
                        branchLabel: branches?.find(
                          (cat) => cat.uuid === formDataCommon?.branch
                        )?.translations?.[form?.language || key],
                        deparmentLabel: departments?.find(
                          (cat) => cat.uuid === formDataCommon?.department
                        )?.translations?.[form?.language || key]?.name,
                        sectionLabel: sections?.find(
                          (cat) => cat.uuid === formDataCommon?.section
                        )?.translations?.[form?.language || key],
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
                    label="Logo"
                  />
                </Stack>
                <Stack alignItems="flex-start">
                  <Button
                    startIcon={<Add />}
                    onClick={() => {
                      formik.resetForm();
                      formik.setValues({
                        language: "",
                        ...cascadingValue,
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
                          name: initialValues?.name ?? "",
                          description: initialValues?.description ?? "",
                          remarks: initialValues?.remarks ?? "",
                          ...cascadingValue,
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
                      name="name"
                      placeholder={translate("enterName")}
                      label={<FormattedMessage id="name" />}
                      value={formik.values.name}
                      onChange={(_, e: any) => formik.handleChange(e)}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={
                        formik.touched.name
                          ? (formik.errors.name as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      value={formik?.values?.branch}
                      label={<FormattedMessage id="submenuBranch" />}
                      name="branch"
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
                        handleCascadingDropdowns(e);
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
                        handleCascadingDropdowns(e);
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
                        handleCascadingDropdowns(e);
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

                  <div className="flex flex-col items-start justify-center">
                    <Dropdown
                      value={formik?.values?.category}
                      label={<FormattedMessage id="category" />}
                      name="category"
                      options={
                        categories?.map((item: any) => ({
                          label:
                            item?.translations?.[formik.values.language]
                              ?.category || item.name,
                          value: item.uuid,
                        })) ?? []
                      }
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleCascadingDropdowns(e);
                      }}
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                      helperText={
                        formik.touched.category
                          ? (formik.errors.category as string)
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="description"
                      placeholder={translate("enterDescription")}
                      value={formik.values.description}
                      label={<FormattedMessage id="description" />}
                      onChange={(_, e: any) => formik.handleChange(e)}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description
                          ? (formik.errors.description as string)
                          : ""
                      }
                    />
                  </div>
                  {/* {renderLanguageFields("description")} */}
                  <div className="flex flex-col items-start justify-center">
                    <InputField
                      name="remarks"
                      placeholder={translate("enterRemarks")}
                      value={formik.values.remarks}
                      label={<FormattedMessage id="remarks" />}
                      onChange={(_, e: any) => formik.handleChange(e)}
                      error={
                        formik.touched.remarks && Boolean(formik.errors.remarks)
                      }
                      helperText={
                        formik.touched.remarks
                          ? (formik.errors.remarks as string)
                          : ""
                      }
                    />
                  </div>
                </div>

                <Stack
                  justifyContent="flex-end"
                  width={"100%"}
                  alignItems="flex-end"
                  onClick={() => formik.handleSubmit()}
                  paddingY={1}
                >
                  <Button variant="contained" size="small" disableElevation>
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
                  {translate(formDataProps.uuid ? "update" : "submitButton")}
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

export default ProcessCreate;
