import { CloseOutlined } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import {
  fetchColumnList,
  fetchColumnValues,
  fetchColumnValuesByParent,
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
}

const initialDropdownList = [
  { label: "", optionsDetails: { tableId: "", columnId: "" } },
];

const CascadingDropDown: FC<DropDownInterface> = ({
  collapse,
  formElement,
  onChange,
  activeLanguage,
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
    dropdownList?: any[];
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
    dropdownList: formElement?.dropdownList ?? [],
  });
  const [dropdownList, setDropdownList] = useState(initialDropdownList);

  const [previewOptions, setPreviewOptions] = useState<
    Record<number, Record<string, any>>
  >({});

  useEffect(() => {
    setDropdownList(
      data?.dropdownList?.length ? data?.dropdownList : initialDropdownList
    );

    if (data.dropdownList?.[0]?.optionsDetails?.tableId) {
      GetColumnValues(data?.dropdownList?.[0]?.optionsDetails?.tableId);
    }
  }, [data?.dropdownList]);
  const [mapFormValues, setmapFormValues] = useState({
    tableId: "",
    columnId: "",
  });

  const [mapOptionDialog, setMapOptionDialog] = useState(-1);
  const [tableOptions, setTableOptions] = useState([]);
  const [columnOptions, setColumnOptions] = useState([]);
  // const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en");
  const { translate } = useTranslation();

  const addDropdown = () => {
    setDropdownList((prev) => [
      ...prev,
      { label: "", optionsDetails: { tableId: "", columnId: "" } },
    ]);
  };

  const removeChildDropdown = (index: number) => {
    setDropdownList((prev) => prev.filter((x: any, i: number) => index !== i));
  };

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

  const handleTableDropdown = (value: string) => {
    // GetColumnList(value);
    setmapFormValues((prev) => ({ ...prev, tableId: value }));
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

  const mapOptions = (index: any, item: any) => {
    setMapOptionDialog(index);
    setmapFormValues({
      tableId: item.optionsDetails.tableId ?? "",
      columnId: item.optionsDetails.columnId ?? "",
    });
    if (index > 0) {
      GetDependantTableList(dropdownList?.[index - 1]?.optionsDetails?.tableId);
    } else {
      GetTableList();
    }
  };

  const GetColumnValues = async (tableId?: any) => {
    try {
      const res = await fetchColumnValues(
        tableId ? tableId : mapFormValues.tableId
      );
      setPreviewOptions({
        ...previewOptions,
        0: { ...previewOptions[0 as any], options: res },
      });
    } catch (error) {}
  };

  const GetColumnValuesByParent = async (
    tableId: string,
    value: string,
    index: number
  ) => {
    try {
      const res = await fetchColumnValuesByParent(tableId, value);

      setPreviewOptions((prev) => ({
        ...prev,
        [index + 1]: {
          ...prev[index + 1],
          options: res ?? [],
        },
      }));
    } catch (error) {}
  };

  const handleMapSubmit = () => {
    if (mapOptionDialog === 0) {
      GetColumnValues();
    }

    let updatedDropdownList = dropdownList?.map((x: any, i: number) =>
      i === mapOptionDialog
        ? { ...x, optionsDetails: { ...x?.optionsDetails, ...mapFormValues } }
        : x
    );
    setDropdownList(updatedDropdownList);
    setMapOptionDialog(-1);
    setmapFormValues({ tableId: "", columnId: "" });
    setTableOptions([]);
    setColumnOptions([]);
    onChange({ ...data, dropdownList: updatedDropdownList }, true);
  };

  const handlePreviewDropdownChange = (
    index: number,
    value: string,
    item: any
  ) => {
    let optionDetail = dropdownList[index];

    let updatedValue = {
      ...previewOptions,
      [index]: { ...previewOptions[index], value: value },
    };
    GetColumnValuesByParent(item.optionsDetails.tableId, value, index);

    setPreviewOptions((prev) => ({
      ...prev,
      [index]: { ...prev[index], value: value },
    }));
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
          {dropdownList?.map((item: any, index: number) => (
            <Dropdown
              label={
                (item?.label || translate("labelTextLabel")) +
                (data.required ? " *" : "")
              }
              options={
                previewOptions?.[index]?.options.map((item: any) => ({
                  label: item?.value,
                  value: item?.id,
                })) ?? []
              }
              value={previewOptions?.[index]?.value ?? ""}
              name=""
              onChange={(e) =>
                handlePreviewDropdownChange(index, e.target.value, item)
              }
            />
          ))}
        </div>
      </div>
      {collapse === formElement?.id && (
        <>
          {/* Form Content */}
          <div className="p-4">
            {dropdownList?.map((item: any, index: number) => (
              <div className="flex items-end p-4 bg-white rounded-md shadow-md mb-2 gap-2">
                <InputField
                  label={translate("labelTextLabel")}
                  placeholder={translate("placeHolderLabel")}
                  value={item?.label}
                  onChange={(value) => {
                    setDropdownList((prev) =>
                      prev.map((x: any, i: number) =>
                        i === index ? { ...x, label: value } : x
                      )
                    );
                  }}
                  onBlur={(value) => onChange({ ...data, dropdownList }, true)}
                />

                <Button
                  variant="contained"
                  onClick={() => mapOptions(index, item)}
                  sx={{
                    height: "36px",
                    width: "160px",
                    mb: "5px",
                  }}
                  disabled={
                    index !== 0 &&
                    !dropdownList?.[index - 1]?.optionsDetails?.tableId
                  }
                >
                  Map options
                </Button>

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => removeChildDropdown(index)}
                    className="text-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full p-2.5 inline-flex items-center"
                  >
                    <CloseOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 pt-2">
            <Button
              variant="contained"
              startIcon={<MdAdd />}
              onClick={addDropdown}
            >
              Add Child Dropdown
            </Button>
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
        open={!!(mapOptionDialog !== -1)}
        handleClose={() => setMapOptionDialog(-1)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button onClick={() => setMapOptionDialog(-1)}>
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
            <Dropdown
              label={data?.label || translate("selectTable")}
              options={
                tableOptions?.map((x: any) => ({
                  label: typeof x === "object" ? x.name : x,
                  value: typeof x === "object" ? x.id : x,
                })) ?? []
              }
              value={mapFormValues?.tableId}
              name=""
              onChange={(e) => handleTableDropdown(e?.target?.value)}
            />

            {/* <Dropdown
              label={data?.label || translate("selectColumn")}
              options={
                columnOptions?.map((x: any) => ({
                  label: x.name,
                  value: x.id,
                })) ?? []
              }
              value={mapFormValues?.columnId}
              name=""
              onChange={(e) => handleColumnDropdown(e?.target?.value)}
            /> */}
          </Stack>
        }
        title={translate("mapDropdownOptions")}
      />
    </>
  );
};

export default CascadingDropDown;
