import React, { useEffect } from "react";
import { AiFillFileText, AiOutlineDownload } from "react-icons/ai";
import useTranslation from "../../hooks/useTranslation";
import { FormattedMessage, useIntl } from "react-intl";
import { elements_type } from "../../components/FormElements/constants";
import DataGrid from "../../components/FormElements/components/DataGrid";
import DataTable from "../../components/DataTable/dataTable";
import FormLabel from "../../components/FormElements/components/FormLabel";
import { GET_DB_TABLES } from "../../apis/urls";
import { getMethod } from "../../apis/ApiMethod";
import MapPreview from "./OpenMapPreview/mapPreview";

// components/FilePreview.tsx
interface FilePreviewProps {
  file: Record<string, string>;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
      <AiFillFileText className="w-4 h-4 text-blue-500" />
      <span className="text-sm text-gray-700 flex-1 truncate">
        {file?.name}
      </span>
      <a
        href={file?.value ? encodeURI(file?.value) : "#"}
        download
        target="_blank"
        rel="noreferrer"
      >
        <AiOutlineDownload className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
      </a>
    </div>
  );
};

interface MultiFilePreviewProps {
  files: any[];
}

const MultiFilePreview: React.FC<MultiFilePreviewProps> = ({ files }) => {
  return (
    <div className="space-y-2">
      {files &&
        Array.isArray(files) &&
        files?.map((file, index) => <FilePreview key={index} file={file} />)}
    </div>
  );
};

interface SignaturePreviewProps {
  imageUrl: string;
}

const SignaturePreview: React.FC<SignaturePreviewProps> = ({ imageUrl }) => {
  console.log(imageUrl);
  return (
    <div className="relative group">
      <div className="border border-gray-400 rounded bg-gray-200 overflow-hidden p-2">
        <img
          src={imageUrl}
          alt="Digital Signature"
          className="max-h-24 object-contain"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
    </div>
  );
};

const ReadOnlyForm = ({ formData }: { formData: any }) => {
  console.log(formData);
  const { locale } = useIntl();
  const renderField = (field: any) => {
    const value =
      field?.value?.[locale] ?? field?.value?.["en"] ?? field?.value;
    switch (field.element_type) {
      case "TEXT_FIELD":
        return (
          <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
            <span className="text-gray-900">{value ?? ""}</span>
          </div>
        );
      case elements_type?.CHECKBOX:
        return (
          <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
            {value ? (
              <FaCheck fill={"#28a745"} />
            ) : (
              <IoMdClose fill={"#dc3545"} />
            )}
          </div>
        );
      case elements_type?.TOGGLE:
        return (
          <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
            {value ? (
              <FaCheck fill={"#28a745"} />
            ) : (
              <IoMdClose fill={"#dc3545"} />
            )}
          </div>
        );
      case "FILE_UPLOAD":
        return <FilePreview file={field ?? {}} />;

      case "MULTI_FILE_UPLOAD":
        return <MultiFilePreview files={value ?? []} />;

      case "DIGITAL_SIGNATURE":
        return <SignaturePreview imageUrl={field?.value} />;
      case "LOCATION":
        return (
          <>
            <MapPreview shapeData={field?.value} height="200px" width="100%" />
          </>
        );
      case elements_type?.SEARCHDATA:
        return (
          <>
            <SearchDataGrid
              field={{
                ...field.value,
                columns: field.value.columns,
                value: field.value.value,
              }}
            />
          </>
        );
      case elements_type?.DATAGRID:
        return (
          <>
            <DataGrid field={field} isPreview={true} />
          </>
        );

      default:
        return (
          <div className="p-2 bg-gray-50 rounded-md border border-gray-200">
            <span className="text-gray-900">{value ?? ""}</span>
          </div>
        );
    }
  };

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

  const renderFormFields = (data: any) => {
    const allFields = extractAllFields(data);
    return Object.entries(allFields)?.map(([key, field]: any) => {
      const parentField = allFields.find(
        (x: any) => field?.dependentDetails?.parentId === x.id
      );
      const parentValue = parentField?.value?.[locale] || parentField?.value;

      const conditionValue =
        field?.dependentDetails?.value?.[locale] ||
        field?.dependentDetails?.value;
      const fieldValue = field?.value?.[locale] || field?.value;

      let condition =
        parentField?.element_type === elements_type.CHECKBOX ||
        parentField?.element_type === elements_type.TOGGLE ||
        parentField?.element_type === elements_type.DROPDOWN ||
        parentField?.element_type === elements_type.RADIOBUTTON
          ? "equals"
          : field?.dependentDetails?.condition;

      const isShow = () => {
        switch (condition) {
          case "equals":
            return parentValue === conditionValue;
          case "contains":
            return parentValue?.includes?.(conditionValue);
          case "greaterThan":
            return parentValue > conditionValue;
          case "lessThan":
            return parentValue < conditionValue;
          default:
            return false;
        }
      };

      const showDependentField =
        !field?.enableDependent || (field?.enableDependent && isShow());

      return (
        (field?.value?.[locale] != null ||
          field?.value != null ||
          field.element_type === elements_type.DATAGRID) &&
        showDependentField && (
          <div key={key} className="mb-4 last:mb-0">
            <div className="flex items-center gap-4">
              {field?.element_type === elements_type?.TITLE ? (
                <label className="w-full text-center text-md font-medium text-gray-700">
                  {field?.value?.[locale]?.labelTitle}
                </label>
              ) : field?.element_type === elements_type.DATAGRID ? (
                <div className="w-full">
                  <label className="w-1/3 text-sm font-medium text-gray-700">
                    {field?.id === "remarks" ? (
                      <FormattedMessage id="remarks"></FormattedMessage>
                    ) : (
                      field?.label?.[locale]?.label
                    )}
                  </label>
                  <div>
                    {(field?.value?.[locale] != null ||
                      field?.value != null ||
                      field.element_type === elements_type.DATAGRID) &&
                      renderField(field)}
                  </div>
                </div>
              ) : (
                <>
                  <label className="w-1/3 text-sm font-medium text-gray-700">
                    {field?.id === "remarks" ? (
                      <FormattedMessage id="remarks"></FormattedMessage>
                    ) : (
                      field?.label?.[locale]?.label
                    )}
                  </label>
                  <div className="w-2/3">
                    {(field?.value?.[locale] != null ||
                      field?.value != null ||
                      field.element_type === elements_type.DATAGRID) &&
                      renderField(field)}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      );
    });
  };

  return <div>{renderFormFields(formData)}</div>;
};

export default ReadOnlyForm;

function SearchDataGrid({ field }: { field: any }) {
  const [dataGrid, setDataGrid] = React.useState<any>({ columns: [], row: [] });
  const { translate } = useTranslation();

  useEffect(() => {
    (async () => {
      const data = await getMethod(
        `${GET_DB_TABLES}${field.tableId}/data/?columns=${field.columns.join(
          ","
        )}`
      );
      setDataGrid({
        row: data.data.filter((x: any) => field.value.includes(x.row_id)),
        columns: Object.keys(data.data[0])?.map((dat) => ({
          key: dat,
          label: dat,
        })),
      });
    })();
  }, [field.tableId, field.columns, field.value]);

  return (
    <div style={{ width: "100%" }}>
      <FormLabel label={translate("SearchData")} />
      <DataTable
        columns={dataGrid.columns}
        data={dataGrid.row}
        loading={false}
        minHeight={0}
      />
    </div>
  );
}

function FaCheck(props: any) {
  return (
    <svg
      stroke="currentColor"
      strokeWidth={0}
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
    </svg>
  );
}

function IoMdClose(props: any) {
  return (
    <svg
      stroke="currentColor"
      strokeWidth={0}
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z" />
    </svg>
  );
}
