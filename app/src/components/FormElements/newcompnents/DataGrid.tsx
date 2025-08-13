/* eslint-disable react-hooks/exhaustive-deps */
import { Close, CloseOutlined, Settings } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getMethod, postMethod } from "../../../apis/ApiMethod";
import { DATA_GRID_ADD_COLUMN, GET_DB_TABLES } from "../../../apis/urls";
import useTranslation from "../../../hooks/useTranslation";
import DialogCustomized from "../../Dialog/DialogCustomized";
import Dropdown from "../../Dropdown/Dropdown";
import { elements_type } from "../constants";
import InputField from "./InputField";
import FormElementPreviewContainer from "../FormElementPreviewContainer";
import { activeLanguageData, updateTranslationData } from "../formTranslations";
import UploadProgressProvider from "../../uploadProgress/UploadProgressProvider";
import UploadToast from "../../uploadProgress/UploadProgress";
import CsvUploaderDialog from "../../../pages/administration/cascading-parent-tables/CsvUploaderDialog";
import CheckBox from "../components/CheckBox";
import { MdDone, MdInfo, MdMessage, MdRefresh } from "react-icons/md";
import { returnErrorToast } from "../../../utils/returnApiError";
import { FormattedMessage, useIntl } from "react-intl";
import MultiSelectField from "../components/MultiSelectDropdown";
import { AiOutlineInfoCircle, AiOutlineSearch, AiOutlineSecurityScan } from "react-icons/ai";
import { BiMessageAlt, BiPlus, BiSelectMultiple, BiShow } from "react-icons/bi";
import { FiColumns } from "react-icons/fi";
import { GrDocumentVerified } from "react-icons/gr";

type tableOptionType =
  | "noofrows"
  | "pagination"
  | "allow_update"
  | "is_update_required"
  | "sorting"
  | "filter"
  // | "additionalColumn"
  | "showOnlyUpdatedRecords"
  | "rowLevelSecurity"
  | "allowMultipleUpdates"
  | "search"
  | "columnToUpdate"
  | "is_show_info_preview"
  | "info_message";

const tableAdditionalOptions = [
  "noofrows",
  "sorting",
  "filter",
  "allow_update",
  "is_update_required",
  // "additionalColumn",
  "showOnlyUpdatedRecords",
  "rowLevelSecurity",
  "allowMultipleUpdates",
  "search",
  "columnToUpdate",
  "is_show_info_preview",
  "info_message",
] as const;
type TableAdditionalOption = (typeof tableAdditionalOptions)[number];

const iconMap = {
  pagination: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12.5}
      height={12}
      viewBox="0 0 25 24"
    >
      <path
        fill="currentColor"
        d="M2.72 11.47a.75.75 0 0 0 0 1.06l4 4a.75.75 0 0 0 1.06-1.06L4.31 12l3.47-3.47a.75.75 0 1 0-1.06-1.06zm19.56 1.06a.75.75 0 0 0 0-1.06l-4-4a.75.75 0 1 0-1.06 1.06L20.69 12l-3.47 3.47a.75.75 0 1 0 1.06 1.06z"
        strokeWidth={0.2}
        stroke="currentColor"
      ></path>
      <path
        fill="currentColor"
        d="M8.5 11.1a.9.9 0 1 0 0 1.8a.9.9 0 0 0 0-1.8m3.1.9a.9.9 0 1 1 1.8 0a.9.9 0 0 1-1.8 0m4 0a.9.9 0 1 1 1.8 0a.9.9 0 0 1-1.8 0"
        strokeWidth={0.2}
        stroke="currentColor"
      ></path>
    </svg>
  ),
  sorting: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="m15.937 2l.48.459c.43.41.644.614.568.788c-.075.174-.379.174-.986.174H8.566C5.491 3.421 2.886 5.345 2 8m6.021 14l-.438-.42c-.43-.413-.644-.618-.568-.793c.075-.175.379-.175.985-.175h7.432c3.078 0 5.685-1.938 6.568-4.612m-7-6.5h2.947c.62 0 .93 0 1.013.2s-.128.44-.55.92l-2.425 2.76c-.422.48-.633.72-.55.92s.392.2 1.012.2H19m-16 0l1.755-3.912C5.08 9.863 5.242 9.5 5.5 9.5s.42.363.745 1.088L8 14.5m3-2.5h1"
        color="currentColor"
      ></path>
    </svg>
  ),
  filter: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.953 2.25h14.094c.667 0 1.237 0 1.693.057c.483.061.95.198 1.334.558c.39.367.545.824.613 1.299c.063.437.063.98.063 1.6v.776c0 .489 0 .91-.036 1.263c-.04.38-.125.735-.331 1.076c-.205.339-.48.585-.798.805c-.299.208-.68.423-1.13.676l-2.942 1.656c-.67.377-.903.513-1.059.648c-.357.31-.562.655-.658 1.086c-.041.185-.046.417-.046 1.123v2.732c0 .901 0 1.666-.093 2.255c-.098.625-.327 1.225-.927 1.6c-.587.367-1.232.333-1.86.184c-.605-.143-1.35-.435-2.244-.784l-.086-.034c-.42-.164-.786-.307-1.076-.457c-.312-.161-.602-.361-.823-.673c-.225-.316-.314-.654-.355-1c-.036-.315-.036-.693-.036-1.115v-2.708c0-.706-.004-.938-.046-1.123a1.93 1.93 0 0 0-.658-1.086c-.156-.135-.39-.271-1.059-.648L3.545 10.36c-.45-.253-.831-.468-1.13-.676c-.318-.22-.593-.466-.798-.805c-.206-.341-.291-.697-.33-1.076c-.037-.352-.037-.774-.037-1.263v-.776c0-.62 0-1.163.063-1.6c.068-.475.223-.932.613-1.299c.384-.36.85-.497 1.334-.558c.456-.057 1.026-.057 1.693-.057M3.448 3.796c-.334.042-.44.11-.495.163c-.05.046-.114.127-.156.418c-.045.318-.047.752-.047 1.438v.69c0 .534 0 .878.028 1.144c.026.247.07.366.124.455c.055.091.147.194.368.348c.234.162.553.343 1.04.617l2.913 1.64l.08.045c.56.315.94.529 1.226.777a3.43 3.43 0 0 1 1.14 1.893c.081.367.081.78.081 1.36v2.759c0 .472.001.762.027.98c.022.198.059.265.086.304c.03.042.09.107.289.21c.212.109.505.224.967.405c.961.376 1.608.627 2.097.743c.479.114.637.055.718.004c.068-.043.173-.13.242-.563c.072-.457.074-1.103.074-2.084v-2.758c0-.58 0-.993.082-1.36a3.43 3.43 0 0 1 1.139-1.893c.286-.248.667-.463 1.225-.777l.081-.045l2.913-1.64c.487-.274.806-.455 1.04-.617c.221-.154.313-.257.368-.348c.054-.089.098-.208.123-.455c.028-.266.029-.61.029-1.145v-.69c0-.685-.002-1.12-.047-1.437c-.042-.291-.107-.372-.155-.418c-.056-.052-.162-.121-.496-.163c-.35-.045-.825-.046-1.552-.046H5c-.727 0-1.201.001-1.552.046"
        clipRule="evenodd"
        strokeWidth={0.2}
        stroke="currentColor"
      ></path>
    </svg>
  ),
  noofrows: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 16 16"
    >
      <path
        fill="none"
        stroke="currentColor"
        d="M2 4.5h1v7m0 0H2m1 0h1m1-7h4V8H5.5v3.5h4m1-7H14V8m0 0h-3m3 0v3.5h-3.5"
        strokeWidth={1}
      ></path>
    </svg>
  ),
  // additionalColumn: (
  //   <svg
  //     stroke="currentColor"
  //     fill="none"
  //     stroke-width="2"
  //     viewBox="0 0 24 24"
  //     stroke-linecap="round"
  //     stroke-linejoin="round"
  //     height={12}
  //     width={12}
  //     xmlns="http://www.w3.org/2000/svg"
  //   >
  //     <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
  //   </svg>
  // ),
  showOnlyUpdatedRecords: <BiShow />,
  rowLevelSecurity: <AiOutlineSecurityScan />,
  allowMultipleUpdates: <BiSelectMultiple />,
  search: <AiOutlineSearch />,
  columnToUpdate: <FiColumns />,
  allow_update: <MdDone />,
  is_update_required: <GrDocumentVerified />,
  is_show_info_preview: <AiOutlineInfoCircle />,
  info_message: <BiMessageAlt />,
};

function DataGrid({ formElement, onChange, collapse, activeLanguage }: any) {
  const { translate } = useTranslation();
  const [options, setOptions] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);

  const { locale } = useIntl();

  const [CsvUploaderDialogOpen, setCsvUploaderDialogOpen] =
    useState<any>(false);
  const [data, setData] = useState<any>({
    id: formElement.id || "",
    element_type: elements_type.DATAGRID,
    tableId: formElement.tableId || "",
    columns: formElement.columns || [],
    translate: formElement?.translate as {
      [key: string]: { label: any; placeholder: any };
    },
    filterColumns: formElement.filterColumns || [],
    noofrows: formElement?.noofrows || 10,
    ...formElement,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    getTableList();
  }, []);

  async function getTableList() {
    // const data = await fetchTableList();
    const data = await getMethod(GET_DB_TABLES);
    setOptions(data.tables);
  }

  useEffect(() => {
    if (!openDialog && columns.length) return; // Only fetch columns when dialog is open
    getColumnList();
  }, [data.tableId, openDialog]);

  const getColumnList = async () => {
    if (!data.tableId) return; // Check if tableId is selected
    const columns_list = await getMethod(
      `${GET_DB_TABLES}${data.tableId}/columns/`
    );

    setColumns(columns_list.columns); // Set the columns state
  };

  function changeHandler(label: string, value: string) {
    const updatedData = {
      ...data,
      [label]: value,
    };
    setData((state: any) => ({
      ...state,
      ...updatedData,
      columns: label === "tableId" ? [] : state.columns, // Reset columns if tableId changes
    }));
  }
  function selectColumns(id: string) {
    const dat = data.columns && data.columns?.some((col: any) => col === id);

    if (dat) {
      setData((state: any) => ({
        ...state,
        columns: state?.columns?.filter((col: any) => col !== id),
      }));
    } else {
      setData((state: any) => ({
        ...state,
        columns: [...(state?.columns || []), id],
      }));
    }
  }

  const isExpanded = collapse === formElement.id;

  const [columnLoader, setColumnLoader] = useState(false);
  const [columnId, setColumnId] = useState("");
  async function addColumn() {
    setColumnLoader(true);
    try {
      const data = await postMethod(
        DATA_GRID_ADD_COLUMN + formElement.tableId + "/",
        {
          column_name: columnName,
          column_type: columnDataType ?? "TEXT",
          column_id: columnId ? columnId : undefined,
          is_choice_field: isChoiceField,
          default_value: defaultValue,

          choice_default_value: defaultValue,
          choice_field_options:
            columnDataType === "TEXT"
              ? defaultTextValues
              : columnDataType === "NUMBER"
              ? defaultNumberValues
              : undefined,
        }
      );
      setColumnId(data.column_id);
      getColumnList();
    } catch (err) {
      returnErrorToast({ error: err, locale });
    } finally {
      setColumnLoader(false);
      setAnchorEl(null);
    }
  }

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    if (name === "additionalColumnLabel" && call_api && value !== "") {
      addColumn();
    }
    let updatedData = updateTranslationData(
      data,
      name,
      elements_type.DATAGRID,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, call_api);
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [columnName, setColumnName] = useState("");
  const [columnDataType, setColumnDataType] = useState<
    "TEXT" | "BOOLEAN" | "NUMBER"
  >("TEXT");

  const [defaultValue, setDefaultValue] = useState<string>("");

  const [isChoiceField, setIsChoiceField] = useState(false);

  const activeData = (key: string) => {
    return activeLanguageData(data, activeLanguage, key);
  };

  const [defaultTextValues, setDefaultTextValues] = useState<string[]>([]);
  const [newDefaultText, setNewDefaultText] = useState("");

  const [defaultNumberValues, setDefaultNumberValues] = useState<number[]>([]);
  const [newDefaultNumber, setNewDefaultNumber] = useState("");

  const optionsWithCreateTable = useMemo(() => {
    return [
      {
        id: "create_table",
        table_name: "+ " + translate("formBuilder.createTable"),
      },
      ...options,
    ];
  }, [options]);

  return (
    <UploadProgressProvider>
      <UploadToast />

      <CsvUploaderDialog
        open={CsvUploaderDialogOpen}
        handleClose={() => setCsvUploaderDialogOpen(false)}
      />

      {!isExpanded && (
        <FormElementPreviewContainer>
          {!formElement.tableId && !formElement?.columns?.length ? (
            <Typography variant="h6" color="text.secondary">
              {translate("formBuilder.gridEmptyPlaceHolder")}
            </Typography>
          ) : (
            <Stack>
              <Typography variant="h6">
                <FormattedMessage id="domain"></FormattedMessage>:&nbsp;
                <b>
                  {options.find((opt: any) => opt.id == formElement?.tableId)
                    ?.table_name || ""}
                </b>
              </Typography>
              <Typography variant="h6">
                <FormattedMessage id="columns"></FormattedMessage>:&nbsp;
                <b>
                  {formElement?.columns
                    ?.map(
                      (domain: any) =>
                        columns?.find((col: any) => col.id === domain)
                          ?.column_name
                    )
                    .join(", ")}
                </b>
              </Typography>
            </Stack>
          )}
        </FormElementPreviewContainer>
      )}
      {isExpanded && (
        <div className="p-4 space-y-6">
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <Dropdown
              label={translate("selectTable")}
              options={optionsWithCreateTable}
              labelKey="table_name"
              valueKey="id"
              name=""
              onChange={(e) => {
                if (e.target.value === "create_table") {
                  setCsvUploaderDialogOpen(true);
                  return;
                }
                changeHandler("tableId", e.target.value);
              }}
              value={data.tableId}
            />

            <IconButton disabled={!data.tableId} onClick={() => getTableList()}>
              <MdRefresh />
            </IconButton>
            <IconButton
              disabled={!data.tableId}
              onClick={() => setOpenDialog(true)}
            >
              <Settings />
            </IconButton>
          </Stack>

          <InputField
            label={translate("labelTextLabel")}
            placeholder={translate("placeHolderLabel")}
            value={activeData("label")}
            onBlur={(e) => updateData("label", e, true)}
            onChange={(e) => updateData("label", e, false)}
          />

          {/* <CheckBox
            label={translate("formBuilder.additionalColumn")}
            isChecked={data.additionalColumn}
            onChange={(e: any) =>
              updateData("additionalColumn", e.target.checked, true)
            }
          />

          {data.additionalColumn ? (
            <InputField
              label={translate("formBuilder.additionalColunnLabel")}
              value={activeData("additionalColumnLabel")}
              onBlur={(e) => updateData("additionalColumnLabel", e, true)}
              onChange={(e) => updateData("additionalColumnLabel", e, false)}
            />
          ) : null} */}

          {/* Grid Dialog */}
          <DialogCustomized
            maxWidth="xl"
            actions={
              <Button
                variant="contained"
                onClick={() => {
                  setOpenDialog(false);
                  onChange(data, true);
                }}
                disableElevation
              >
                {translate("submitButton")}
              </Button>
            }
            open={openDialog}
            handleClose={() => setOpenDialog(false)}
            title="Data Grid Configurator"
            content={
              <Grid container>
                <Grid
                  item
                  md={4}
                  paddingRight={2}
                  borderRight={`1px solid ${theme.palette.divider}`}
                >
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div>
                      <InputField label={undefined} placeholder="Search..." />
                    </div>
                    <Button
                      variant="contained"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      className="w-[230px]"
                      startIcon={<BiPlus />}
                    >
                      <FormattedMessage id="addAdditionalColumn"></FormattedMessage>
                    </Button>
                  </div>

                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          width: 500,
                          p: 2,
                          borderRadius: 2,
                        },
                      },
                    }}

                    // PaperProps={{
                    //   sx: { width: 500, p: 2, borderRadius: 2 },
                    // }}
                  >
                    <Box>
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="h6">
                          <FormattedMessage id="addAdditionalColumn" />
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setAnchorEl(null)}
                        >
                          <CloseOutlined fontSize="small" />
                        </IconButton>
                      </div>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <label
                            style={{
                              fontSize: 12,
                              marginBottom: 4,
                              display: "block",
                            }}
                          >
                            <FormattedMessage id="columnName"></FormattedMessage>
                            :
                          </label>
                          <input
                            type="text"
                            placeholder={translate("enterName")}
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                            style={{
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: "4px",
                              fontSize: "12px",
                              padding: "5px",
                              height: "36px",
                              width: "100%",
                            }}
                            className="shadow"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <label
                            style={{
                              fontSize: 12,
                              marginBottom: 4,
                              display: "block",
                            }}
                          >
                            {" "}
                            <FormattedMessage id="columnDataType"></FormattedMessage>
                            :
                          </label>
                          <Dropdown
                            value={columnDataType}
                            options={[
                              { label: "Text", value: "TEXT" },
                              { label: "Boolean", value: "BOOLEAN" },
                              { label: "Number", value: "NUMBER" },
                            ]}
                            onChange={(event) => {
                              setColumnDataType(
                                event.target.value as
                                  | "TEXT"
                                  | "BOOLEAN"
                                  | "NUMBER"
                              );
                              if (event.target.value === "BOOLEAN") {
                                setIsChoiceField(false);
                              }
                            }}
                            name={""}
                            noSelectOption
                          />
                        </Grid>

                        {!isChoiceField && (
                          <Grid item xs={12} md={12}>
                            <label
                              style={{
                                fontSize: 12,
                                marginBottom: 4,
                                display: "block",
                              }}
                            >
                              <FormattedMessage id="defaultValue"></FormattedMessage>
                              :
                            </label>

                            {columnDataType === "TEXT" && (
                              <input
                                type="text"
                                placeholder={translate("enterName")}
                                value={defaultValue}
                                onChange={(e) =>
                                  setDefaultValue(e.target.value)
                                }
                                style={{
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  padding: "5px",
                                  height: "36px",
                                  width: "100%",
                                }}
                                className="shadow"
                              />
                            )}

                            {columnDataType === "NUMBER" && (
                              <input
                                type="number"
                                placeholder={translate("enterNumber")}
                                value={defaultValue}
                                onChange={(e) =>
                                  setDefaultValue(e.target.value)
                                }
                                style={{
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  padding: "5px",
                                  height: "36px",
                                  width: "100%",
                                }}
                                className="shadow"
                              />
                            )}

                            {columnDataType === "BOOLEAN" && (
                              <Dropdown
                                value={defaultValue}
                                options={[
                                  { label: "True", value: "true" },
                                  { label: "False", value: "false" },
                                ]}
                                onChange={(e) =>
                                  setDefaultValue(e.target.value)
                                }
                                noSelectOption
                              />
                            )}
                          </Grid>
                        )}

                        {columnDataType !== "BOOLEAN" && (
                          <Grid item xs={12} md={12}>
                            <label
                              style={{
                                fontSize: 12,
                                marginBottom: 4,
                                display: "block",
                              }}
                            >
                              <FormattedMessage id="isChoiceField"></FormattedMessage>
                              :
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isChoiceField}
                                onChange={(e) =>
                                  setIsChoiceField(e.target.checked)
                                }
                              />
                              <Typography variant="body2">
                                <FormattedMessage id="enableChoiceValue"></FormattedMessage>
                              </Typography>
                            </div>
                          </Grid>
                        )}

                        {isChoiceField && columnDataType === "TEXT" && (
                          <Grid item xs={12}>
                            <label
                              style={{
                                fontSize: 12,
                                marginBottom: 4,
                                display: "block",
                              }}
                            >
                              <FormattedMessage id="choiceFieldOptions"></FormattedMessage>
                              :
                            </label>
                            {defaultTextValues?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {defaultTextValues?.map((val, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gray-100 rounded px-2 py-1 flex items-center text-sm"
                                  >
                                    {val}
                                    <button
                                      onClick={() => {
                                        const updated = [...defaultTextValues];
                                        updated.splice(idx, 1);
                                        setDefaultTextValues(updated);
                                      }}
                                      style={{
                                        marginLeft: 6,
                                        cursor: "pointer",
                                      }}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder={`"${translate("pressEntertoAdd")}"`}
                              value={newDefaultText}
                              onChange={(e) =>
                                setNewDefaultText(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  newDefaultText.trim()
                                ) {
                                  setDefaultTextValues([
                                    ...defaultTextValues,
                                    newDefaultText.trim(),
                                  ]);
                                  setNewDefaultText("");
                                  e.preventDefault();
                                }
                              }}
                              style={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: "4px",
                                fontSize: "12px",
                                padding: "5px",
                                height: "36px",
                                width: "100%",
                              }}
                              className="shadow"
                            />
                          </Grid>
                        )}

                        {isChoiceField && columnDataType === "NUMBER" && (
                          <Grid item xs={12}>
                            <label
                              style={{
                                fontSize: 12,
                                marginBottom: 4,
                                display: "block",
                              }}
                            >
                              <FormattedMessage id="defaultNumberOptions"></FormattedMessage>
                              :
                            </label>

                            {defaultNumberValues?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {defaultNumberValues?.map((val, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-gray-100 rounded px-2 py-1 flex items-center text-sm"
                                  >
                                    {val}
                                    <button
                                      onClick={() => {
                                        const updated = [
                                          ...defaultNumberValues,
                                        ];
                                        updated.splice(idx, 1);
                                        setDefaultNumberValues(updated);
                                      }}
                                      style={{
                                        marginLeft: 6,
                                        cursor: "pointer",
                                      }}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <input
                              type="number"
                              placeholder="e.g., 0"
                              value={newDefaultNumber}
                              onChange={(e) =>
                                setNewDefaultNumber(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  newDefaultNumber.trim() !== "" &&
                                  !isNaN(Number(newDefaultNumber))
                                ) {
                                  setDefaultNumberValues([
                                    ...defaultNumberValues,
                                    Number(newDefaultNumber),
                                  ]);
                                  setNewDefaultNumber("");
                                  e.preventDefault();
                                }
                              }}
                              style={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: "4px",
                                fontSize: "12px",
                                padding: "5px",
                                height: "36px",
                                width: "100%",
                              }}
                              className="shadow"
                            />
                          </Grid>
                        )}
                        {isChoiceField && (
                          <Grid item xs={12}>
                            <label
                              style={{
                                fontSize: 12,
                                marginBottom: 4,
                                display: "block",
                              }}
                            >
                              <FormattedMessage id="choiceDefaultValue"></FormattedMessage>
                              :
                            </label>
                            <Dropdown
                              value={defaultValue}
                              options={[
                                ...(columnDataType === "NUMBER"
                                  ? defaultNumberValues
                                  : defaultTextValues),
                              ].map((item: any) => ({
                                label: item,
                                value: item,
                              }))}
                              onChange={(e) => setDefaultValue(e.target.value)}
                            />
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="flex-end" mt={1}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                addColumn();
                                setAnchorEl(null);
                              }}
                              disabled={columnLoader}
                            >
                              <FormattedMessage id="submitButton" />
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Popover>

                  <Stack
                    marginTop={1}
                    spacing={0.2}
                    height="60vh"
                    overflow="auto"
                    divider={<Divider />}
                    border={`1px solid ${theme.palette.divider}`}
                    borderRadius={1}
                    paddingX={1}
                  >
                    {columnLoader ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <CircularProgress></CircularProgress>
                      </div>
                    ) : (
                      <>
                        {columns.map((col: any) => (
                          <ButtonBase
                            sx={{ justifyContent: "flex-start" }}
                            onClick={() => selectColumns(col.id)}
                          >
                            &nbsp; &nbsp;
                            <FormControlLabel
                              sx={{ flex: 1 }}
                              checked={
                                data.columns &&
                                data.columns?.some((c: any) => c === col.id)
                              }
                              control={<Checkbox defaultChecked size="small" />}
                              label={
                                <Typography variant="caption">
                                  {col.column_name}
                                </Typography>
                              }
                            />
                          </ButtonBase>
                        ))}
                      </>
                    )}
                  </Stack>
                </Grid>
                <Grid item md={8} paddingX={2}>
                  <Typography variant="h5" mb={1.5}>
                    {translate("selectedColumns")}
                  </Typography>

                  <Box>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                      borderRadius={1}
                      padding={1}
                      border={`1px solid ${theme.palette.divider}`}
                      height={"100px"}
                      alignContent="flex-start"
                    >
                      {data?.columns?.map((val: any) => (
                        <Chip
                          key={val.id}
                          label={
                            <Typography variant="caption">
                              {
                                columns?.find((col: any) => col.id === val)
                                  ?.column_name
                              }
                            </Typography>
                          }
                          size={"small"}
                          onDelete={() => selectColumns(val)}
                        />
                      ))}
                    </Stack>
                  </Box>
                  <br />
                  <Typography variant="h5" mb={1.5}>
                    {translate("tableOptions")}
                  </Typography>

                  {/* <Stack divider={<Divider />} spacing={1} marginTop={1}> */}
                  <Box height="40vh" overflow="auto">
                    <Grid container spacing={2} overflow="auto">
                      {tableAdditionalOptions.map(
                        (type: TableAdditionalOption) => (
                          <Grid item md={6}>
                            <Box
                              borderRadius={1}
                              padding={1}
                              border={`1px solid ${theme.palette.divider}`}
                              minHeight={"50px"}
                              display={"flex"}
                              alignItems={"center"}
                              width={"100%"}
                            >
                              <TableOptionsItem
                                key={type}
                                icon={iconMap[type]}
                                text={type}
                                updateData={updateData}
                                formElement={data}
                                getColumnList={getColumnList}
                                activeLanguage={activeLanguage}
                                columns={columns}
                              />
                            </Box>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Box>
                  {/* </Stack> */}
                </Grid>
              </Grid>
            }
          />
        </div>
      )}
    </UploadProgressProvider>
  );
}

export default DataGrid;

function TableOptionsItem({
  icon,
  text,
  updateData,
  formElement,
  getColumnList,
  activeLanguage,
  columns,
}: {
  icon: any;
  text: tableOptionType;
  updateData: (name: string, value: any, call_api?: boolean) => void;
  formElement?: {
    pagination?: boolean;
    noofrows?: number;
    sorting?: boolean;
    filter?: boolean;
    additionalColumn?: string;
    tableId?: string;
    translate?: any;
    filterColumns?: any[];
    showOnlyUpdatedRecords?: boolean;
    rowLevelSecurity?: any;
    allowMultipleUpdates?: boolean;
    search?: boolean;
    columnToUpdate?: any;
    allow_update?: boolean;
    is_update_required?: boolean;
    is_show_info_preview?: boolean;
    info_message?: string;
  };
  getColumnList: () => Promise<any>;
  activeLanguage?: string;
  columns: any[];
}) {
  const { locale } = useIntl();
  const { translate } = useTranslation();
  const theme = useTheme();

  const renderInput = (text: tableOptionType) => {
    switch (text) {
      case "noofrows":
        return (
          <input
            type="number"
            placeholder=""
            style={{
              border: `1px solid ${theme.palette.divider}`,
              width: "50px",
              padding: "4px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            value={formElement?.noofrows}
            onChange={(e) => {
              updateData("noofrows", e.target.value, false);
            }}
          />
        );
      case "info_message":
        return (
          <input
            placeholder=""
            style={{
              border: `1px solid ${theme.palette.divider}`,
              width: "60%",
              padding: "4px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
            value={formElement?.info_message}
            onChange={(e) => {
              updateData("info_message", e.target.value, false);
            }}
          />
        );
      // case "additionalColumn":
      //   return (
      //     <input
      //       type="text"
      //       placeholder="enterName"
      //       style={{
      //         border: `1px solid ${theme.palette.divider}`,
      //         width: "100px",
      //         paddingLeft: "5px",
      //         borderRadius: "4px",
      //         fontSize: "12px",
      //         padding: "5px",
      //       }}
      //       value={
      //         formElement?.translate?.[activeLanguage ?? ""]
      //           ?.additionalColumnLabel
      //       }
      //       onBlur={(e) =>
      //         updateData("additionalColumnLabel", e.target.value, false)
      //       }
      //       onChange={(e) => {
      //         updateData("additionalColumnLabel", e.target.value, false);
      //       }}
      //     />
      //   );

      case "rowLevelSecurity":
        return (
          <div className="w-[40%]">
            <Dropdown
              // label={translate("selectColumns")}
              options={
                columns?.map((x) => ({
                  label: x?.column_name,
                  value: x?.id,
                })) ?? []
              }
              name=""
              onChange={(e) => {
                updateData("rowLevelSecurity", e.target.value, false);
              }}
              value={formElement?.rowLevelSecurity}
            />
          </div>
        );
      case "columnToUpdate":
        return (
          <div className="w-[40%]">
            <Dropdown
              // label={translate("selectColumns")}
              options={
                columns?.map((x) => ({
                  label: x?.column_name,
                  value: x?.id,
                })) ?? []
              }
              name=""
              onChange={(e) => {
                updateData("columnToUpdate", e.target.value, false);
              }}
              value={formElement?.columnToUpdate}
            />
          </div>
        );

      default:
        return (
          <>
            <Switch
              size="small"
              checked={formElement?.[text] || false}
              onChange={(e) => {
                updateData(text, e.target.checked, false);
              }}
            />
          </>
        );
    }
  };

  return (
    <Stack width={"100%"}>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
        width={"100%"}
      >
        <div className="flex gap-2 items-center justify-center">
          <Box
            sx={{
              ".svg": {
                width: 18,
                height: 18,
                fill: "currentColor",
              },
            }}
          >
            {icon}
          </Box>
          <Typography flex={1} variant="caption">
            {translate(text)}
          </Typography>
        </div>
        {renderInput(text)}
      </Stack>

      <Collapse in={text === "filter" && formElement?.filter}>
        <MultiSelectField
          // menuHeight="200px"
          label={translate("selectColumns")}
          options={
            columns?.map((x) => ({
              label: x?.column_name,
              value: x?.id,
            })) ?? []
          }
          name=""
          // value={data?.accept_file_validation ?? []}
          value={
            Array.isArray(formElement?.filterColumns)
              ? formElement?.filterColumns
              : []
          }
          onChange={(e: any) => {
            updateData("filterColumns", e.target.value, false);
          }}
        />
      </Collapse>
    </Stack>
  );
}
