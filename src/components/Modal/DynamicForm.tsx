/* eslint-disable react-hooks/exhaustive-deps */
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FormattedMessage, useIntl } from "react-intl";
import SignatureCanvas from "react-signature-canvas";
import {
  fetchColumnValues,
  fetchColumnValuesByParent,
} from "../../apis/flowBuilder";
import OpenLayersMap from "../../containers/map/OpenLayersMap";
import Dropdown from "../Dropdown/Dropdown";
import DataGrid from "../FormElements/components/DataGrid";
import DatePickerCustom from "../FormElements/components/DatePicker";
import DateTimePickerCustom from "../FormElements/components/DateTimePicker";
import FileUpload from "../FormElements/components/FileUpload";
import FormLabel from "../FormElements/components/FormLabel";
import InputField from "../FormElements/components/InputField";
import MultiFileUpload from "../FormElements/components/MultiFileUpload";
import MultiSelectField from "../FormElements/components/MultiSelectDropdown";
import SearchData from "../FormElements/components/SearchData";
import { elements_type } from "../FormElements/constants";
import "./DynamicForm.css";
import TextArea from "../FormElements/newcompnents/TextArea";

const DynamicFormPopup = ({
  formData = [],
  actionList,
  onSubmit,
  loader,
  previewActiveLang,
  noSubmit,
  formContainerWidth,
  isActionForm,
  selected,
  isPreview = false,
}: any) => {
  const extractAllFields = (data: any[]): any[] => {
    const fields: any[] = [];

    data.forEach((item) => {
      if (
        (item.element_type === "GRID" ||
          item.element_type === elements_type.GROUPFIELDS) &&
        Array.isArray(item.fields)
      ) {
        fields.push(...extractAllFields(item.fields)); // recurse
      } else {
        fields.push(item);
      }
    });

    return fields;
  };

  const [formState, setFormState] = useState<any>({});
  const [selectedAction, setSelectedAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitted, setSubmitted] = useState(false);
  const [formError, setformError] = useState({});
  const [cascadingOptions, setCascadingOptions] = useState({});

  console.log(formError);
  const { locale } = useIntl();

  useEffect(() => {
    setRemarks("");
  }, [locale, selected]);

  const canvasRefs = useRef<any>({});
  const addToRefs = (el: any, id: string) => {
    if (el) {
      canvasRefs.current[id] = el;
    }
  };

  function fileToBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader: any = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
      reader.onerror = (error: any) => reject(error);
      reader.readAsDataURL(file); // Read the file as a data URL
    });
  }
  useEffect(() => {
    const initialFormState: any = {};
    formData?.forEach((field: any) => {
      if (field.element_type === "DATE") {
        initialFormState[field.id] = {
          label: field?.label,
          translate: field?.translate,
          id: field.id,
          value: new Date().toISOString().split("T")[0],
        };
      }
      if (field.element_type === elements_type.DATE_TIME) {
        initialFormState[field.id] = {
          label: field?.label,
          translate: field?.translate,

          id: field.id,
          value: new Date().toISOString().slice(0, 16),
        }; // Set to today's date
      }
      if (field.element_type === elements_type.CHECKBOX) {
        initialFormState[field.id] = {
          label: field?.label,
          translate: field?.translate,
          id: field.id,
          value:
            field?.translate?.[locale]?.options?.length &&
            field?.allow_multiple_selection
              ? []
              : field?.translate?.[locale]?.options?.length &&
                !field?.allow_multiple_selection
              ? ""
              : false,
        }; // Set to false
      }

      if (field.element_type === elements_type.TOGGLE) {
        initialFormState[field.id] = {
          label: field?.label,
          translate: field?.translate,
          id: field.id,
          value: false,
        }; // Set to false
      }
      if (field.element_type === elements_type.TITLE) {
        initialFormState[field.id] = {
          value: field?.translate,
          id: field.id,
        };
      }
    });
    setFormState((prev: any) => ({ ...prev, ...initialFormState }));
  }, [formData]);

  useEffect(() => {
    if (actionList && actionList.length === 1) {
      setSelectedAction(actionList?.[0]?.uuid);
    }
  }, [actionList]);

  const handleActionChange = (e: any) => {
    setSelectedAction(e.target.value);
  };

  const handleRemarksChange = (e: any) => {
    setRemarks(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const signatureData: any = {};
    const dataGridData: any = {};
    setSubmitted(true);

    try {
      for (const [id, canvas] of Object.entries(
        canvasRefs?.current ?? {}
      ) as any) {
        signatureData[id] = {
          id: id,
          value: canvas?.toDataURL("image/png"),
          label: JSON?.stringify(
            formData?.find((item: any) => item.id === id)?.translate
          ),
        };
      }
    } catch (error) {
      console.log(error);
    }

    if (isFormValid && selectedAction) {
      onSubmit({ ...formState, ...signatureData }, selectedAction, {
        [locale]: remarks,
      });
    }
  };

  const handleChange = async (field: any, value: any, e: any) => {
    if (field?.element_type === elements_type.DATAGRID) {
      value = { updated_data: Object.values(value) };
    }

    if (field?.element_type === "FILE_UPLOAD") {
      const extension = "." + value?.name?.split(".").pop();

      const maxFileSizeBytes = field?.max_file_size * 1024 * 1024;

      if (
        maxFileSizeBytes &&
        value?.size > maxFileSizeBytes &&
        field?.enableValidation
      ) {
        toast.error(`File must not exceed ${field?.max_file_size} MB limit`);
        e.target.value = "";
        return;
      }

      if (
        field?.enableValidation &&
        !field?.accept_file_validation?.includes(extension)
      ) {
        toast.error(
          `File must be in above format ${field?.accept_file_validation?.join(
            " ,"
          )}`
        );
        e.target.value = "";
        return;
      }

      value = { url: await fileToBase64(value), name: value.name };
    }

    if (field?.element_type === elements_type?.SEARCHDATA) {
      value = {
        tableId: field.tableId,
        value: value,
        columns: field.columns,
      };
    }

    if (field?.element_type === elements_type?.MULTIFILEUPLOAD) {
      const maxFileSizeBytes = field?.max_file_size * 1024 * 1024;
      const fileList = Array.from(value); // Convert FileList to an array

      const invalidFiles = fileList?.filter(
        (file: any) =>
          maxFileSizeBytes &&
          file?.size > maxFileSizeBytes &&
          field.enableValidation
      );

      if (invalidFiles.length > 0) {
        toast.error(`Some files exceed the ${field?.max_file_size} MB limit.`);
        e.target.value = ""; // Clear input field
        return;
      }

      if (
        field?.enableValidation &&
        fileList?.filter(
          (item: any) =>
            !field?.accept_file_validation?.includes(
              "." + item?.name?.split(".")?.pop()
            )
        ).length > 0
      ) {
        toast.error(
          `Some files are not in the allowed formats: ${field?.accept_file_validation?.join(
            " ,"
          )}`
        );
        e.target.value = "";
        return;
      }

      // Use Promise.all to handle all files concurrently
      const base64List = await Promise.all(
        fileList?.map(async (item: any) => {
          return { url: await fileToBase64(item), name: item?.name }; // Convert each file to Base64
        })
      );

      value = base64List;
    }

    if (
      field?.element_type === elements_type.TEXTFIELD ||
      field?.element_type === elements_type.DROPDOWN ||
      field?.element_type === elements_type.MULTISELECTDROPDOWN ||
      field?.element_type === elements_type.CASCADINGDROPDOWN ||
      field?.element_type === elements_type.RADIOBUTTON ||
      field?.element_type === elements_type.MULTILINETEXTFIELD ||
      (field?.element_type === elements_type.CHECKBOX &&
        field?.translate?.[locale]?.options?.length)
    ) {
      value = { ...formState?.[field.id]?.value, [locale]: value };
    }
    setFormState((prev: any) => ({
      ...prev,
      [field.id]: {
        value: value,
        id: field.id,
        label: field?.translate,
      },
    }));
  };

  const dependentConditions = (field: any, fieldDetails: any = {}) => {
    const allFields = extractAllFields(formData);
    let value = field.value;
    let parentElement = allFields.find(
      (item: any) => item.id === field?.parentId
    );
    let parentElementType = allFields.find(
      (item: any) => item.id === field?.parentId
    )?.element_type;
    let condition = field.condition;
    let parentValue = String(formState?.[field?.parentId]?.value);

    if (parentElementType === elements_type.CHECKBOX) {
      if (
        parentElement?.translate?.[locale]?.options?.length &&
        parentElement?.allow_multiple_selection
      ) {
        condition = "contains";
      } else {
        condition = "equals";
      }

      if (parentElement?.translate?.[locale]?.options?.length) {
        parentValue = formState?.[field?.parentId]?.value?.[locale];
      }
    }
    if (
      parentElementType === elements_type.TOGGLE ||
      parentElementType === elements_type.DROPDOWN ||
      parentElementType === elements_type.RADIOBUTTON
    ) {
      condition = "equals";
    }

    if (
      parentElementType === elements_type.TEXTFIELD ||
      parentElementType === elements_type.DROPDOWN ||
      parentElementType === elements_type.MULTISELECTDROPDOWN ||
      parentElementType === elements_type.RADIOBUTTON
    ) {
      parentValue = formState?.[field?.parentId]?.value?.[locale];
      value = field?.value?.[locale];
    }

    console.log(value, "_____Value");
    console.log(parentValue, "_____ParentValue");

    const isShow = () => {
      switch (condition) {
        case "equals":
          return parentValue === value;
        case "contains":
          return parentValue?.includes?.(value);
        case "greaterThan":
          return parentValue > value;
        case "lessThan":
          return parentValue < value;
        default:
          return false;
      }
    };

    if (!isShow() && formState[fieldDetails?.id]?.value) {
      setFormState((prev: any) => ({
        ...prev,
        [fieldDetails.id]: {
          value: null,
          id: fieldDetails.id,
          label: fieldDetails?.translate,
        },
      }));
    }

    return isShow();
  };

  const isFormValidFunction = () => {
    let formFields = formData?.reduce((acc: any, field: any) => {
      if (field.element_type === "GROUPFIELDS") {
        // Add fields from GROUPFIELDS to accumulator
        return [...acc, ...(field?.fields ?? [])];
      }
      if (field.element_type === "GRID") {
        // Add fields from GRID to accumulator
        return [...acc, ...(field?.fields ?? [])];
      }
      // Add non-GROUPFIELDS elements directly
      return [...acc, field];
    }, []);

    let isFormFieldValid: any = {};
    formFields
      ?.filter(
        (x: any) =>
          ![
            elements_type.TITLE,
            elements_type.TOGGLE,
            elements_type.DIGITASIGNATURE,
          ].includes(x.element_type)
      )
      .forEach((item: any) => {
        let fieldValue = formState?.[item.id]?.value?.[locale];
        if (
          item.enableDependent &&
          !dependentConditions(item?.dependentDetails ?? {})
        ) {
          return;
        }
        if (
          item.element_type === elements_type.MULTIFILEUPLOAD ||
          item.element_type === elements_type.FILEUPLOAD ||
          item.element_type === elements_type.UPLOAD_DATA_DYN ||
          item.element_type === elements_type.DATE ||
          item.element_type === elements_type.DATE_TIME ||
          item.element_type === elements_type.CHECKBOX ||
          item.element_type === elements_type.TOGGLE ||
          item.element_type === elements_type.DATAGRID
        ) {
          fieldValue = formState?.[item.id]?.value;
        }
        if (
          item.element_type === elements_type.TEXTFIELD ||
          item.element_type === elements_type.DROPDOWN ||
          item.element_type === elements_type.MULTISELECTDROPDOWN ||
          item.element_type === elements_type.CASCADINGDROPDOWN ||
          item.element_type === elements_type.MULTILINETEXTFIELD
        ) {
          // let arFieldValue = formState?.[item.id]?.value?.["ar"];
          // let enFieldValue = formState?.[item.id]?.value?.["en"];
          if (
            item.element_type === elements_type.TEXTFIELD &&
            fieldValue &&
            item.enableValidation
          ) {
            const id = item?.id;

            if (item.input_type === "string") {
              const length = fieldValue.length;

              const maxLength = Number(item?.max_length);
              const minLength = Number(item?.min_length);

              if (maxLength || minLength) {
                isFormFieldValid[id] =
                  length > maxLength
                    ? `The value must not exceed ${maxLength} characters.`
                    : length < minLength
                    ? `The value must be at least ${minLength} characters.`
                    : null;
              }
              return;
            } else {
              const value = Number(formState?.[item.id]?.value?.[locale]);
              // const enValue = Number(formState?.[item.id]?.value?.["ar"]);
              // const arValue = Number(formState?.[item.id]?.value?.["en"]);
              const maxValue = Number(item?.max_value);
              const minValue = Number(item?.min_value);

              if (maxValue || minValue) {
                isFormFieldValid[id] =
                  value > maxValue
                    ? `The value must not exceed ${maxValue}`
                    : value < minValue
                    ? `The value must be at least ${maxValue}`
                    : null;
              }
              return;
            }
          }

          if (item.required) {
            isFormFieldValid[item?.id] = fieldValue ? null : "Required";
          }
        } else if (
          item.element_type === elements_type.DATAGRID &&
          item?.is_update_required
        ) {
          if (!fieldValue) {
            isFormFieldValid[item?.id] =
              "Column update is required";
          }
        } else {
          if (!item.required) {
            isFormFieldValid[item?.id] = null;
          }
          if (item.required && !fieldValue) {
            isFormFieldValid[item?.id] = "Required";
          }
          if (item.required && fieldValue) {
            isFormFieldValid[item?.id] = null;
          }
        }
      });

    setformError(isFormFieldValid);
    return Object.values(isFormFieldValid).every((i) => i === null);
  };

  const isFormValid = useMemo(isFormValidFunction, [formData, formState]);

  const fetchAllColumnValues = async () => {
    try {
      const allFields = extractAllFields(formData);

      const filteredData = allFields.filter(
        (item: any) =>
          item.element_type === elements_type.DROPDOWN &&
          item.enableCascading &&
          !item?.dropdownDetails?.parentId &&
          item?.dropdownDetails?.tableId
      ); // Exclude items with parentId === true

      const results = await Promise.all(
        filteredData.map(async (item: any) => {
          const res = await fetchColumnValues(item?.dropdownDetails?.tableId);
          return {
            tableId: item?.dropdownDetails?.tableId,
            options: res,
            id: item.id,
          };
        })
      );
      setCascadingOptions((prev: any) => {
        const updatedOptions = results.reduce(
          (acc, { tableId, options, id }, index) => {
            acc[id] = { ...prev[id], options };
            return acc;
          },
          {} as any
        );

        return { ...prev, ...updatedOptions };
      });
    } catch (error) {
      console.error("Error fetching column values:", error);
    }
  };

  const onChangeParentCascading = (field: any, value: any) => {
    const allFields = extractAllFields(formData);

    let isChildElement = allFields?.find(
      (item: any) => field.id === item?.dropdownDetails?.parentId
    );

    if (isChildElement?.id) {
      GetColumnValuesByParent(
        isChildElement?.dropdownDetails?.tableId,
        value,
        isChildElement?.id
      );
    }
  };

  const GetColumnValuesByParent = async (
    tableId: string,
    value: string,
    id: string,
    isPreview = false
  ) => {
    try {
      const res = await fetchColumnValuesByParent(tableId, value);
      setCascadingOptions((prev: any) => ({ ...prev, [id]: { options: res } }));
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllColumnValues();
  }, [formData]);

  return (
    // <div className="popup-overlay">
    //   <div className="popup-content">
    //     <button className="close-button" onClick={onClose}>
    //       ×
    //     </button>
    //     <h2>{formData.name}</h2>
    //     <p>{formData.description}</p>
    <div>
      <Grid container spacing={2} width={formContainerWidth - 130}>
        {formData?.map((field: any, index: number) => {
          const isShowDependenField =
            !field?.enableDependent ||
            (field.enableDependent &&
              dependentConditions(field?.dependentDetails ?? {}, field));

          console.log(isShowDependenField, field?.element_type);

          return (
            <PreviewElements
              isPreview={isPreview}
              field={field}
              handleChange={handleChange}
              index={index}
              formContainerWidth={formContainerWidth}
              formState={formState}
              formError={formError}
              isSubmitted={isSubmitted}
              addToRefs={addToRefs}
              cascadingOptions={cascadingOptions}
              setCascadingOptions={setCascadingOptions}
              onChangeParentCascading={onChangeParentCascading}
              isShowDependenField={isShowDependenField}
              lang={locale}
              previewActiveLang={previewActiveLang}
              dependentConditions={dependentConditions}
            />
          );
        })}
      </Grid>

      {!isPreview && (
        <>
          <div className="relative mt-2">
            <label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FormattedMessage id="selectanActionInbox" />
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                <FormattedMessage id="requiredErrorMessage" />
              </span>
            </label>
            <div className="relative">
              {/* Pulsing border effect */}
              <div className="absolute -inset-0.5 bg-blue-200 rounded-lg animate-pulse"></div>
              {/* Dropdown with special styling */}
              <select
                value={selectedAction}
                onChange={handleActionChange}
                className="relative w-full p-3 bg-white border-2 border-blue-500 rounded-lg 
                          text-gray-800 font-medium cursor-pointer
                          shadow-sm hover:border-blue-600 hover:bg-blue-50
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                          transition-all duration-200
                          appearance-none" // Added this class to remove default arrow
              >
                <option value="">
                  <FormattedMessage id={"selectanActionInbox"} />
                </option>
                {actionList?.map((action: any, index: number) => (
                  <option key={index} value={action.uuid}>
                    {action?.translations?.[locale]?.name}
                  </option>
                ))}
              </select>
              {/* Helper arrow indicator */}
              <div className="absolute top-1/2 transform -translate-y-1/2 pointer-events-none rtl:left-3 rtl:right-unset ltr:right-3 ltr:left-unset">
                <i
                  className={`fas fa-chevron-down text-blue-400 hover:text-blue-800`}
                ></i>
              </div>
            </div>
            {/* Helper text */}
            <p
              className={`mt-2 text-sm text-left ${
                isSubmitted && !selectedAction
                  ? "text-red-600"
                  : "text-blue-600"
              } rtl:text-right`}
            >
              <FormattedMessage id={"actionLabelInbox"} />
            </p>
          </div>

          {isActionForm && (
            <>
              <span className="text-gray-700 text-sm font-medium">
                <FormattedMessage id="remarks"></FormattedMessage> :
              </span>

              <div
                style={{
                  transition: "opacity 0.3s ease",
                  marginTop: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",

                  // position: "relative",
                }}
              >
                <textarea
                  style={{
                    minHeight: "60px",
                    width: "100%",
                    outline: "none",
                    resize: "vertical",
                  }}
                  rows={3}
                  value={remarks}
                  onChange={handleRemarksChange}
                ></textarea>
              </div>
            </>
          )}
        </>
      )}
      {!noSubmit && (
        <div className="button-container">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loader}
            style={{
              textTransform: "capitalize",
            }}
          >
            <FormattedMessage
              id={isPreview ? "submitButton" : "submitButton"}
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(DynamicFormPopup);

const PreviewElements = ({
  field,
  formContainerWidth = 700,
  handleChange,
  formState,
  formError,
  addToRefs,
  formErrorMessage,
  isSubmitted,
  cascadingOptions,
  setCascadingOptions,
  onChangeParentCascading,
  isShowDependenField,
  isPreview,
  width,
  previewActiveLang,
  dependentConditions,
}: any) => {
  const { locale } = useIntl();

  const activeLanguage = isPreview ? previewActiveLang : locale;

  const fieldContainerStyle = {
    marginBottom: "20px", // Add margin to separate form fields
  };

  const Label =
    field?.translate?.[activeLanguage]?.label ||
    field?.label?.[activeLanguage]?.label;
  const Placeholder =
    field?.translate?.[activeLanguage]?.placeholder ||
    field?.label?.[activeLanguage]?.placeholder;
  const value = formState?.[field.id]?.value?.[activeLanguage];

  const options =
    field?.translate?.[activeLanguage]?.options?.map((x: any) => ({
      value: x.label ?? "",
      id: x.label ?? "",
    })) || [];

  return (
    <Grid
      width={formContainerWidth}
      item
      md={
        // field?.element_type === elements_type.TITLE
        //   ? 12
        //   :
        width ? width : 12
      }
    >
      {isShowDependenField &&
        (() => {
          switch (field?.element_type) {
            case elements_type.TITLE:
              return (
                <Typography
                  textAlign="center"
                  variant="h3"
                  sx={{
                    color: "#000",
                    marginBottom: "15px",
                    width: "100%",
                  }}
                >
                  {field?.translate?.[activeLanguage]?.labelTitle || ""}
                </Typography>
              );
            case elements_type.TEXTFIELD:
              return (
                <InputField
                  type={field?.input_type !== "string" ? "number" : undefined}
                  step={field?.input_type === "float" ? "0.01" : undefined}
                  label={(Label || "Label") + (field?.required ? " *" : "")}
                  placeHolder={Placeholder}
                  onChange={(value) => handleChange(field, value)}
                  id=""
                  value={value ?? ""}
                  name={field?.id}
                  error={isSubmitted && formError?.[field.id]}
                  helperText={
                    isSubmitted && formError?.[field.id]
                      ? formError?.[field.id]
                      : ""
                  }
                  min={
                    field.enableValidation &&
                    (field.input_type === "number" ||
                      field.input_type === "float")
                      ? field.min_value
                      : undefined
                  }
                  max={
                    field.enableValidation &&
                    (field.input_type === "number" ||
                      field.input_type === "float")
                      ? field.max_value
                      : undefined
                  }
                  minlength={
                    field.enableValidation && field.input_type === "string"
                      ? field.min_length
                      : undefined
                  }
                  maxlength={
                    field.enableValidation && field.input_type === "string"
                      ? field.max_length
                      : undefined
                  }
                />
              );
            case elements_type.MULTILINETEXTFIELD:
              return (
                <TextArea
                  placeholder={Placeholder}
                  type={field?.input_type !== "string" ? "number" : undefined}
                  label={(Label || "Label") + (field?.required ? " *" : "")}
                  onChange={(value) => handleChange(field, value)}
                  value={value ?? ""}
                  name={field?.id}
                  error={isSubmitted && formError?.[field.id]}
                  helperText={
                    isSubmitted && formError?.[field.id]
                      ? formError?.[field.id]
                      : ""
                  }
                  rows={field?.rows}
                  min={
                    field.enableValidation &&
                    (field.input_type === "number" ||
                      field.input_type === "float")
                      ? field.min_value
                      : undefined
                  }
                  max={
                    field.enableValidation &&
                    (field.input_type === "number" ||
                      field.input_type === "float")
                      ? field.max_value
                      : undefined
                  }
                />
              );
            case elements_type.CHECKBOX: {
              return (
                <Box className="py-2">
                  <div className="flex flex-col gap-2">
                    {field?.translate?.[activeLanguage]?.options?.length ? (
                      <>
                        <Typography
                          variant="subtitle1"
                          textTransform={"capitalize"}
                        >
                          {Label}
                        </Typography>
                        <Stack spacing={1}>
                          {field?.translate?.[activeLanguage]?.options?.map(
                            (item: any, index: number) => {
                              return (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  key={index}
                                >
                                  <input
                                    value={item?.label}
                                    checked={
                                      field?.allow_multiple_selection
                                        ? value?.includes(item?.label)
                                        : value === item?.label
                                    }
                                    id="checked-checkbox"
                                    type="checkbox"
                                    onChange={(e) => {
                                      const selected = value ?? [];
                                      const currentValue = e.target.value;
                                      const isChecked = e.target.checked;

                                      if (field.allow_multiple_selection) {
                                        if (isChecked) {
                                          if (
                                            !selected.includes(currentValue)
                                          ) {
                                            selected.push(currentValue);
                                          }
                                        } else {
                                          const index =
                                            selected.indexOf(currentValue);
                                          if (index > -1) {
                                            selected.splice(index, 1);
                                          }
                                        }

                                        handleChange(field, selected);
                                      } else {
                                        handleChange(
                                          field,
                                          isChecked ? currentValue : ""
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                  />
                                  <Typography
                                    variant="subtitle1"
                                    textTransform={"capitalize"}
                                    ml={1}
                                  >
                                    {(item.label || "Label") +
                                      (field.required ? " *" : "")}
                                  </Typography>
                                </Stack>
                              );
                            }
                          )}
                        </Stack>
                      </>
                    ) : (
                      <Stack direction={"row"} alignItems={"center"}>
                        <input
                          // checked={formState?.[field.id]?.value ? true : false}
                          id="checked-checkbox"
                          type="checkbox"
                          onChange={(e) => {
                            handleChange(field, e.target.checked);
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <Typography
                          variant="subtitle1"
                          textTransform={"capitalize"}
                          ml={1}
                        >
                          {(Label || "Label") + (field.required ? " *" : "")}
                        </Typography>
                      </Stack>
                    )}
                  </div>
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                  {/* <CheckBox
                    label={
                      (field?.label || "Label") + (field.required ? " *" : "")
                    }
                    onChange={(e) => handleChange(field , e.target.checked)}
                    isChecked={!!formState?.[field.id]?.value}              
                  /> */}
                </Box>
              );
            }
            case elements_type.DROPDOWN:
              return (
                <>
                  <Dropdown
                    label={(Label || "Label") + (field.required ? " *" : "")}
                    value={value ?? ""}
                    name={field.id}
                    labelKey="value"
                    valueKey="id"
                    options={
                      field?.enableCascading
                        ? cascadingOptions?.[field?.id]?.options ?? []
                        : options ?? []
                    }
                    onChange={(e) => {
                      handleChange(field, e.target.value);
                      if (field?.enableCascading) {
                        onChangeParentCascading(field, e.target.value);
                      }
                    }}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            case elements_type.RADIOBUTTON:
              return (
                <>
                  <FormLabel
                    label={(Label || "Label") + (field.required ? " *" : "")}
                  ></FormLabel>

                  <FormControl style={fieldContainerStyle}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      onChange={(e, value) => {
                        handleChange(field, e.target.value);
                      }}
                      value={value ?? ""}
                    >
                      {options?.map((element: any) => (
                        <FormControlLabel
                          key={element.value}
                          value={element.id}
                          control={<Radio />}
                          label={element.value}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </>
              );
            case elements_type.DATE:
              return (
                <>
                  <DatePickerCustom
                    label={(Label || "Label") + (field?.required ? " *" : "")}
                    value={formState?.[field.id]?.value ?? ""}
                    name={field.id}
                    onChange={(e) => handleChange(field, e.target.value)}
                    min={field.enableValidation ? field?.start_date : undefined}
                    max={field.enableValidation ? field?.end_date : undefined}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );

            case elements_type.DATE_TIME:
              return (
                <>
                  <DateTimePickerCustom
                    label={(Label || "Label") + (field?.required ? " *" : "")}
                    value={formState?.[field.id]?.value ?? ""}
                    name={field.id}
                    onChange={(e) => handleChange(field, e.target.value)}
                    min={field.enableValidation ? field?.start_date : undefined}
                    max={field.enableValidation ? field?.end_date : undefined}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            case elements_type.TOGGLE:
              return (
                <FormControlLabel
                  label={
                    <Typography variant="subtitle1" textTransform="capitalize">
                      {(Label || "Label") + (field.required ? " *" : "")}
                    </Typography>
                  }
                  control={
                    <Switch
                      defaultChecked={field?.defaultChecked}
                      checked={!!formState?.[field.id]?.value}
                      onChange={(e, checked) => handleChange(field, checked)}
                    />
                  }
                  style={{ fontWeight: "500", color: "black" }}
                />
              );
            case elements_type.FILEUPLOAD:
              return (
                <>
                  <FileUpload
                    accept={
                      (field?.enableValidation &&
                        field?.accept_file_validation?.join(",")) ??
                      undefined
                    }
                    label={(Label || "Label") + (field.required ? " *" : "")}
                    value={formState?.[field.id]?.value ?? ""}
                    name={field.id}
                    onChange={(e) =>
                      handleChange(field, e?.target?.files?.[0], e)
                    }
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            case elements_type.UPLOAD_DATA_DYN:
              return (
                <>
                  <FileUpload
                    accept={
                      (field?.enableValidation &&
                        field?.accept_file_validation?.join(",")) ??
                      undefined
                    }
                    label={(Label || "Label") + (field.required ? " *" : "")}
                    value={formState?.[field.id]?.value ?? ""}
                    name={field.id}
                    onChange={(e) =>
                      handleChange(field, e?.target?.files?.[0], e)
                    }
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            case elements_type.MULTIFILEUPLOAD:
              return (
                <>
                  <MultiFileUpload
                    accept={
                      (field?.enableValidation &&
                        field?.accept_file_validation?.join(",")) ??
                      undefined
                    }
                    label={(Label || "Label") + (field.required ? " *" : "")}
                    value={formState?.[field.id]?.value ?? []}
                    name={field.id}
                    onChange={(e) => handleChange(field, e?.target?.files, e)}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            case elements_type.MULTISELECTDROPDOWN:
              return (
                <>
                  <MultiSelectField
                    label={
                      (field?.translate?.[activeLanguage]?.label || "Label") +
                      (field.required ? " *" : "")
                    }
                    labelKey="value"
                    valueKey="id"
                    options={options || []}
                    value={value && Array.isArray(value) ? value : []}
                    onChange={(e: any) => handleChange(field, e.target.value)}
                    name={field.id}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );

            case elements_type.DIGITASIGNATURE:
              return (
                <>
                  <div>
                    {Label && (
                      <Typography
                        variant="subtitle1"
                        textTransform={"capitalize"}
                        mb={1}
                      >
                        {Label}
                      </Typography>
                    )}
                    <div className="border border-gray-400 rounded bg-gray-200">
                      <SignatureCanvas
                        ref={(el) => addToRefs(el, field.id)}
                        penColor="green"
                        canvasProps={{
                          height: 200,
                          className: "sigCanvas w-full",
                        }}
                      />
                    </div>
                  </div>
                  {/* {isSubmitted && formError?.[field.id] && (
                  <FormHelperText
                    error={true}
                    sx={{ direction: "inherit", textAlign: "inherit" }}
                  >
                    <>{formError[field.id] && formError?.[field.id]}</>
                  </FormHelperText>
                )} */}
                </>
              );
            case elements_type.GROUPFIELDS:
              return (
                <div
                  className="mt-2"
                  style={{
                    border: "1px solid #dfdfdf",
                    padding: 12,
                    borderRadius: "10px",
                  }}
                >
                  {/* {JSON.stringify(field.fields)} */}
                  <Typography
                    textAlign="center"
                    variant="h3"
                    sx={{
                      fontSize: "18px",
                      color: "#000",
                      marginBottom: "16px",
                      width: "100%",
                    }}
                  >
                    {field?.translate?.[locale]?.title && (
                      <p className="text-gray-800 text-center">
                        {field?.translate?.[locale]?.title}
                      </p>
                    )}
                    {/* {field?.title || ""} */}
                  </Typography>
                  {field.fields?.length > 0 ? (
                    <Grid container>
                      {field?.fields?.map((field: any, index: number) => {
                        const isShowDependenField =
                          !field?.enableDependent ||
                          (field.enableDependent &&
                            dependentConditions(
                              field?.dependentDetails ?? {},
                              field
                            ));
                        return (
                          <PreviewElements
                            field={field}
                            index={index}
                            formContainerWidth={formContainerWidth}
                            handleChange={handleChange}
                            formState={formState}
                            formError={formError}
                            formErrorMessage={formErrorMessage}
                            isSubmitted={isSubmitted}
                            addToRefs={addToRefs}
                            cascadingOptions={cascadingOptions}
                            setCascadingOptions={setCascadingOptions}
                            onChangeParentCascading={onChangeParentCascading}
                            isShowDependenField={isShowDependenField}
                            lang={locale}
                            isPreview={isPreview}
                            previewActiveLang={previewActiveLang}
                          />
                        );
                      })}
                    </Grid>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        padding: "20px",
                        color: "#555",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        margin: "20px 0",
                      }}
                    >
                      <InfoIcon
                        style={{
                          fontSize: 50,
                          marginBottom: "10px",
                          color: "#90caf9",
                        }}
                      />
                      <Typography
                        variant="h6"
                        textAlign="center"
                        color="textSecondary"
                      >
                        No fields have been added to this form group.
                      </Typography>
                    </div>
                  )}
                </div>
              );

            // case elements_type.CASCADINGDROPDOWN:
            //   return (
            //     <>
            //       <Dropdown
            //         label={(Label || "Label") + (field.required ? " *" : "")}
            //         options={cascadingOptions?.[field?.id]?.options ?? []}
            //         labelKey="value"
            //         valueKey="id"
            //         value={value ?? ""}
            //         name={field.id}
            //         onChange={(e) => {
            //           handleChange(field, e.target.value);
            //           onChangeParentCascading(field, e.target.value);
            //         }}
            //       />
            //       {isSubmitted && formError?.[field.id] && (
            //         <FormHelperText
            //           error={true}
            //           sx={{ direction: "inherit", textAlign: "inherit" }}
            //         >
            //           <>{formError[field.id] && formError?.[field.id]}</>
            //         </FormHelperText>
            //       )}
            //     </>
            //   );
            case elements_type.LOCATION:
              return (
                <Paper sx={{ padding: 2 }} elevation={0}>
                  <Typography variant="subtitle1" gutterBottom>
                    {field.translate?.[locale]?.label || "Location"}
                  </Typography>
                  <OpenLayersMap
                    height={field.map_height || 300}
                    width="100%"
                    onLocationSelect={(coords) => {
                      handleChange(field, coords);
                    }}
                  />
                </Paper>
              );
            case elements_type.GRID:
              return (
                <Grid container spacing={2}>
                  {field?.fields?.map((fieldTemp: any, index: number) => {
                    const isShowDependenField =
                      !fieldTemp?.enableDependent ||
                      (fieldTemp.enableDependent &&
                        dependentConditions(
                          fieldTemp?.dependentDetails ?? {},
                          fieldTemp
                        ));

                    return (
                      <PreviewElements
                        field={fieldTemp}
                        index={index}
                        formContainerWidth={formContainerWidth}
                        handleChange={handleChange}
                        formState={formState}
                        formError={formError}
                        formErrorMessage={formErrorMessage}
                        isSubmitted={isSubmitted}
                        addToRefs={addToRefs}
                        cascadingOptions={cascadingOptions}
                        setCascadingOptions={setCascadingOptions}
                        onChangeParentCascading={onChangeParentCascading}
                        isShowDependenField={isShowDependenField}
                        lang={locale}
                        isPreview={isPreview}
                        previewActiveLang={previewActiveLang}
                        width={12 / field?.noOfColumns}
                      />
                    );
                  })}
                </Grid>
              );
            case elements_type.SEARCHDATA:
              return (
                <SearchData
                  field={field}
                  onSelect={(value) => {
                    handleChange(field, value);
                  }}
                />
              );
            case elements_type.DATAGRID:
              return (
                <>
                  <DataGrid
                    field={field}
                    isPreview={isPreview}
                    handleChange={(value: any) => {
                      handleChange(field, value);
                    }}
                  />
                  {isSubmitted && formError?.[field.id] && (
                    <FormHelperText
                      error={true}
                      sx={{ direction: "inherit", textAlign: "inherit" }}
                    >
                      <>{formError[field.id] && formError?.[field.id]}</>
                    </FormHelperText>
                  )}
                </>
              );
            default:
              return null;
          }
        })()}
    </Grid>
  );
};
