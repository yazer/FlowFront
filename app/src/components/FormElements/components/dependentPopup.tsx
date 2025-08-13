import { useState } from "react";
import useTranslation from "../../../hooks/useTranslation";
import { elements_type } from "../constants";
import { Button, Stack } from "@mui/material";
import CheckBox from "../newcompnents/Addons/CheckBox";
import { AiFillEdit } from "react-icons/ai";
import { FormattedMessage, useIntl } from "react-intl";
import DialogCustomized from "../../Dialog/DialogCustomized";
import Dropdown from "../../Dropdown/Dropdown";
import InputField from "../newcompnents/InputField";

const fieldListForDropdownValue = [
  elements_type.RADIOBUTTON,
  elements_type.TOGGLE,
  elements_type.DROPDOWN,
  elements_type.CHECKBOX,
];

const fieldListforGlobalLanguage = [
  elements_type.TEXTFIELD,
  elements_type.DROPDOWN,
  elements_type.MULTISELECTDROPDOWN,
  elements_type.RADIOBUTTON,
];

const checkBoxOrToggleOptions = [
  { label: "Checked", value: "true" },
  { label: "UnChecked", value: "false" },
];

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

const DependentPopup = ({
  data,
  formData,
  onChange,
  activeLanguage,
}: {
  data: any;
  formData: any;
  onChange: any;
  activeLanguage: any;
}) => {
  const allFields = extractAllFields(formData);

  const { locale } = useIntl();
  const [dependentValue, setDependentValues] = useState(data?.dependentDetails);
  const [open, setOpen] = useState(false);

  const { translate } = useTranslation();

  const handleSubmit = () => {
    onChange("dependentDetails", dependentValue, true);
    setOpen(false);
  };

  const parentField = allFields?.find(
    (item: any) => item.id === dependentValue?.parentId
  );

  const options =
    (parentField?.element_type === elements_type?.CHECKBOX &&
      !parentField?.translate?.[locale]?.options?.length) ||
    parentField?.element_type === elements_type?.TOGGLE
      ? checkBoxOrToggleOptions
      : parentField?.translate?.[activeLanguage]?.options?.map((x: any) => ({
          label: x.label ?? "",
          value: x.label ?? "",
        })) || [];

  const handleValueChanges = (value: any) => {
    let updatedValue = {
      ...dependentValue,
      value: value,
    };

    if (fieldListforGlobalLanguage?.includes(parentField?.element_type)) {
      updatedValue.value = { [locale]: value };
    }
    setDependentValues(updatedValue);
  };

  const Value = fieldListforGlobalLanguage?.includes(parentField?.element_type)
    ? dependentValue?.value?.[locale]
    : dependentValue?.value;

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} gap={2} mt={2}>
        <CheckBox
          label={translate("enableDependent")}
          isChecked={data?.enableDependent}
          onChange={(e: any) => {
            if (e.target.checked) {
              setOpen(true);
            }
            onChange("enableDependent", e.target.checked, true);
          }}
        />
        <Button
          startIcon={<AiFillEdit />}
          size="small"
          onClick={() => {
            setOpen(true);
          }}
        >
          <FormattedMessage id="editDependentDetails"></FormattedMessage>
        </Button>
      </Stack>

      <DialogCustomized
        open={open}
        handleClose={() => setOpen(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setOpen(false)}>
              {translate("cancel")}
            </Button>
            <Button variant="contained" disableElevation onClick={handleSubmit}>
              {translate("submitButton")}
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            <Dropdown
              label={translate("selectParentElement")}
              options={
                allFields
                  ?.filter(
                    (x: any) =>
                      // allFields.includes(x.element_type) &&
                      x.id !== data.id && !x.enableCascading
                  )
                  ?.map((x: any) => ({
                    label: x?.translate?.[activeLanguage]?.label ?? "Label",
                    value: x?.id,
                  })) ?? []
              }
              value={dependentValue?.parentId}
              name=""
              onChange={(e) => {
                let updatedValue = {
                  ...dependentValue,
                  parentId: e.target.value,
                };
                setDependentValues(updatedValue);
              }}
            />
            {!fieldListForDropdownValue.includes(parentField?.element_type) && (
              <Dropdown
                label={translate("condition")}
                options={conditions?.[activeLanguage]}
                value={dependentValue?.condition}
                name=""
                onChange={(e) => {
                  let updatedValue = {
                    ...dependentValue,
                    condition: e.target.value,
                  };
                  setDependentValues(updatedValue);
                }}
              />
            )}

            {fieldListForDropdownValue.includes(parentField?.element_type) ? (
              <Dropdown
                name=""
                label={translate("value")}
                value={Value}
                options={options ?? []}
                onChange={(e) => {
                  handleValueChanges(e.target.value);
                }}
              />
            ) : (
              <InputField
                label={translate("value")}
                placeholder={translate("valuePlaceholder")}
                // value={data[activeLanguage].label}
                value={Value}
                onChange={(value) => {
                  handleValueChanges(value);
                }}
              />
            )}
          </Stack>
        }
        title={translate("dependantPopupTitle")}
      />
    </>
  );
};

export default DependentPopup;

//

let conditions: any = {
  ar: [
    { value: "equals", label: "يساوي" },
    { value: "contains", label: "يحتوي" },
    { value: "greaterThan", label: "أكبر من" },
    { value: "greaterThan", label: "أصغر من" },
  ],
  en: [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "greaterThan", label: "Greater than" },
    { value: "greaterThan", label: "Lesser than" },
  ],
};
