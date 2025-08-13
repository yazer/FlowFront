import { useEffect, useState } from "react";
import { getMethod } from "../../../apis/ApiMethod";
import { GET_DB_TABLES } from "../../../apis/urls";
import Dropdown from "../../Dropdown/Dropdown";
import MultiSelectField from "../components/MultiSelectDropdown";
import useTranslation from "../../../hooks/useTranslation";
import { elements_type } from "../constants";
import FormElementPreviewContainer from "../FormElementPreviewContainer";
import { Stack, Typography } from "@mui/material";
import { activeLanguageData, updateTranslationData } from "../formTranslations";
import InputField from "./InputField";

function SearchData({
  formElement,
  onChange,
  collapse = "",
  activeLanguage,
}: {
  formElement: any;
  onChange: any;
  collapse?: string;
  activeLanguage: string;
}) {
  const [tableDetails, setTableDetails] = useState<any>([]);
  const [allColumns, setAllColumns] = useState<any>([]);
  const [data, setData] = useState<{
    tableId: string;
    element_type: string;
    columns: Array<any>;
    // @ts-ignore
  }>({
    element_type: elements_type.SEARCHDATA,
    ...formElement,
    tableId: formElement?.tableId || "",
    columns: formElement?.columns || [],
  });
  const { translate } = useTranslation();

  useEffect(() => {
    (async () => {
      if (data.tableId) {
        const columns = await getMethod(
          `${GET_DB_TABLES}${data.tableId}/columns/`
        );
        setAllColumns(columns.columns);
      }
    })();
  }, [data.tableId]);

  useEffect(() => {
    onChange(data, true); // Call onChange with the updated data
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMethod(GET_DB_TABLES);

        setTableDetails(data.tables);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const isExpanded = collapse === formElement.id;

  function updateData(
    name: string,
    value: boolean | string | any,
    call_api?: boolean
  ) {
    let updatedData = updateTranslationData(
      data,
      name,
      elements_type.TEXTFIELD,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, call_api);
  }

  const activeData = (key: string) => {
    return activeLanguageData(data, activeLanguage, key);
  };
  return (
    <div className="p-2 flex flex-col gap-2">
      {!isExpanded && (
        <FormElementPreviewContainer>
          {!formElement.tableId && !formElement?.columns?.length ? (
            <Typography variant="h6" color="text.secondary">
              {translate("formBuilder.gridEmptyPlaceHolder")}
            </Typography>
          ) : (
            <Stack>
              <Typography variant="h6">
                Domain:&nbsp;
                <b>
                  {tableDetails.find(
                    (opt: any) => opt.id == formElement?.tableId
                  )?.table_name || ""}
                </b>
              </Typography>
              <Typography variant="h6">
                Columns:&nbsp;
                <b>
                  {formElement?.columns
                    ?.map(
                      (domain: any) =>
                        allColumns?.find((col: any) => col.id === domain)
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
        <>
          <Dropdown
            label={translate("selectTable")}
            options={tableDetails}
            labelKey="table_name"
            valueKey="id"
            name="searchData"
            onChange={(e) =>
              setData((state) => ({
                ...state,
                tableId: e.target.value,
                columns: [],
              }))
            }
            value={data.tableId}
          />
          {data.tableId && allColumns.length && (
            <MultiSelectField
              menuHeight="200px"
              label={translate("selectField")}
              options={allColumns}
              // options={[]}
              labelKey="column_name"
              valueKey="id"
              value={data.columns || formElement?.columns || []}
              name="multiSelectData"
              onChange={(e: any) => {
                setData((state) => ({ ...state, columns: e.target.value }));
              }}
            />
          )}

          <InputField
            label={translate("labelTextLabel")}
            placeholder={translate("placeHolderLabel")}
            // value={data[activeLanguage].label}
            value={activeData("label")}
            onBlur={(e) => updateData("label", e, true)}
            onChange={(e) => updateData("label", e, false)}
          />
        </>
      )}
    </div>
  );
}

export default SearchData;
