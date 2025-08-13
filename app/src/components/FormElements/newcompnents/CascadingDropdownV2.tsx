import { Button, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { RiSettings3Fill } from "react-icons/ri";
import {
  fetchDependantTables,
  fetchTableList,
} from "../../../apis/flowBuilder";
import useTranslation from "../../../hooks/useTranslation";
import DialogCustomized from "../../Dialog/DialogCustomized";
import Dropdown from "../../Dropdown/Dropdown";
import CheckBox from "../components/CheckBox";
import { elements_type } from "../constants";
import { updateTranslationData } from "../formTranslations";
import InputField from "./InputField";

interface DropDownInterface {
  collapse: any;
  formElement: any;
  onDelete: () => void;
  onChange: (value: any, api_call?: boolean) => void;
  ar: { label?: string; options: { value: string; label: string }[] };
  en: { label?: string; options: { value: string; label: string }[] };
  name?: any;
  activeLanguage: any;
  formData: any;
}

const CascadingDropDownV2: FC<DropDownInterface> = ({
  collapse,
  formElement,
  onChange,
  activeLanguage,
  formData,
}) => {
  const [data, setData] = useState<{
    id: string;
    label: string;
    options: string[];
    required: boolean;
    show_all_stages: boolean;
    width: string;
    element_type: string;
    translate?: any;
    dropdownDetails?: {};
  }>({
    element_type: elements_type.CASCADINGDROPDOWN,
    id: formElement?.id || "",
    label: formElement?.label || "",
    required: formElement?.required || false,
    options: formElement?.options || [""],
    show_all_stages: formElement?.show_all_stages || false,
    width: formElement?.width,
    translate: {
      en: { options: [{ label: "" }] },
      ar: { options: [{ label: "" }] },
      ...formElement.translate,
    },
    dropdownDetails: formElement?.dropdownDetails ?? {},
  });
  const [previewOptions, setPreviewOptions] = useState([]);

  const [settingsValues, setSettingsValues] = useState(
    formElement?.dropdownDetails
  );

  const [settingsDialog, setSettingsDialog] = useState(false);
  const [tableOptions, setTableOptions] = useState([]);
  const { translate } = useTranslation();

  const GetTableList = async () => {
    try {
      const res = await fetchTableList();
      setTableOptions(res ?? []);
    } catch (error) {}
  };

  const GetDependantTableList = async (parentId: string) => {
    try {
      const res = await fetchDependantTables(parentId);
      setTableOptions(res ?? []);
    } catch (error) {}
  };
  const handleTableDropdown = (value: string, name: string) => {
    let tableId = formData?.find((item: any) => item.id === value)
      ?.dropdownDetails?.tableId;
    setSettingsValues((prev: any) => ({ ...prev, [name]: value }));

    if (name === "parentId") {
      if (tableId) {
        GetDependantTableList(tableId);
      } else {
        toast.error("Parent Element not mapped with table");
      }
    }
  };

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    onChange(data, call_api);
  }

  function updateLabel(value: string, call_api?: boolean) {
    const updatedData = updateTranslationData(
      data,
      "label",
      elements_type.DROPDOWN,
      value,
      activeLanguage
    );
    setData(updatedData);
    call_api && onChange(updatedData, true);
  }

  const mapOptions = () => {
    setSettingsDialog(true);
    GetTableList();
  };

  const handleMapSubmit = () => {
    setSettingsDialog(false);
    setTableOptions([]);
    onChange({ ...data, dropdownDetails: settingsValues }, true);
  };

  return (
    <>
      <div className="p-4 bg-gray-50 ">
        {/* <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3> */}
        <div className="bg-white p-4 rounded-md shadow-md h-[fit-content]">
          {/* <CheckBox
            label={data[activeLanguage].label}
            isChecked={data.required}
            onChange={(e: any) => {}}
          /> */}

          <Dropdown
            label={
              (data?.translate[activeLanguage].label ||
                translate("labelTextLabel")) + (data.required ? " *" : "")
            }
            options={
              previewOptions?.map((x: any) => ({
                label: x.value,
                value: x.id,
              })) ?? []
            }
            value=""
            name=""
            onChange={() => {}}
          />
        </div>
      </div>
      {collapse === formElement?.id && (
        <>
          {/* Form Content */}
          <div className="p-4">
            <div className="flex items-end p-4 bg-white rounded-md shadow-md mb-2 gap-2">
              <InputField
                label={translate("labelTextLabel")}
                placeholder={translate("placeHolderLabel")}
                value={data?.translate[activeLanguage].label}
                onChange={(value) => updateLabel(value, false)}
                onBlur={(value) => updateLabel(value, true)}
              />

              <IconButton onClick={mapOptions}>
                <RiSettings3Fill />
              </IconButton>
            </div>
          </div>
          <div className="flex pl-4 pr-4 pb-4 justify-between">
            <CheckBox
              label={translate("requiredErrorMessage")}
              isChecked={data.required}
              onChange={(e: any) =>
                updateData("required", e.target.checked, true)
              }
            />
            <CheckBox
              label={translate("showAllStages")}
              isChecked={data.show_all_stages}
              onChange={(e) =>
                updateData("show_all_stages", e.target.checked, true)
              }
            />
          </div>
        </>
      )}

      <DialogCustomized
        open={settingsDialog}
        handleClose={() => setSettingsDialog(false)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setSettingsDialog(false)}>
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleMapSubmit}
            >
              {translate("submitButton")}
            </Button>
          </Stack>
        }
        content={
          <Stack spacing={1}>
            {formData.filter(
              (x: any) =>
                x.element_type === elements_type.CASCADINGDROPDOWN &&
                x.id !== data.id
            ).length > 0 && (
              <Dropdown
                label={translate("selectParentElement")}
                options={
                  formData
                    ?.filter(
                      (x: any) =>
                        x.element_type === elements_type.CASCADINGDROPDOWN &&
                        x.id !== data.id
                    )
                    ?.map((x: any) => ({
                      label: x?.translate?.[activeLanguage]?.label ?? "Label",
                      value: x?.id,
                    })) ?? []
                }
                value={settingsValues?.parentId}
                name=""
                onChange={(e) =>
                  handleTableDropdown(e?.target?.value, "parentId")
                }
              />
            )}
            <Dropdown
              label={translate("selectTable")}
              options={
                tableOptions?.map((x: any) => ({
                  label: x?.name,
                  value: x?.id,
                })) ?? []
              }
              value={settingsValues?.tableId}
              name=""
              onChange={(e) => handleTableDropdown(e?.target?.value, "tableId")}
            />
          </Stack>
        }
        title={translate("sidemenuSettings")}
      />
    </>
  );
};

export default CascadingDropDownV2;
