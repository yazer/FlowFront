import { elements_type } from "./constants";

export const formTranslations: any = {
  [elements_type.TEXTFIELD]: {
    label: true,
    placeholder: true,
  },
  [elements_type.TOGGLE]: {
    label: true,
  },
  [elements_type.CHECKBOX]: {
    label: true,
  },
  [elements_type.TITLE]: {
    labelTitle: true,
  },
  [elements_type.FILEUPLOAD]: {
    label: true,
  },
  [elements_type.UPLOAD_DATA_DYN]: {
    label: true,
  },
  [elements_type.GROUPFIELDS]: {
    title: true,
  },
  [elements_type.DIGITASIGNATURE]: {
    label: true,
  },
  [elements_type.MULTISELECTDROPDOWN]: {
    label: true,
  },
  [elements_type.DATE]: {
    label: true,
  },
  [elements_type.DATE_TIME]: {
    label: true,
  },
  [elements_type.DROPDOWN]: {
    label: true,
  },
  [elements_type.RADIOBUTTON]: {
    label: true,
  },
  [elements_type.LOCATION]: {
    label: true,
  },
  [elements_type.DATAGRID]: {
    label: true,
    additionalColumnLabel: true,
  },
};

export function updateTranslationData(
  data: any,
  name: string,
  element_type: string,
  value: string,
  lang: string
) {
  let updatedData = { ...data };
  if (formTranslations[element_type]?.[name]) {
    updatedData = {
      ...data,
      translate: {
        ...data.translate,
        [lang]: { ...data.translate?.[lang], [name]: value },
      },
    };
  } else {
    updatedData = { ...data, [name]: value };
  }
  return updatedData;
}

export const updateTranslationOptions = (
  data: any,
  lang: string,
  operation: "edit" | "delete" | "add",
  index: number,
  value?: string
): any => {
  const updatedData = { ...data, translate: { ...data.translate } };

  if (operation === "edit") {
    // Edit only the specified language
    updatedData.translate[lang] = {
      ...data.translate[lang],
      options: data.translate[lang]?.options?.map((item: any, i: number) =>
        i === index ? { label: value } : item
      ),
    };
  } else if (operation === "delete") {
    // Delete the index from all languages
    Object.keys(data.translate).forEach((lng) => {
      updatedData.translate[lng] = {
        ...data.translate[lng],
        options: data.translate[lng]?.options?.filter(
          (_: any, i: number) => i !== index
        ),
      };
    });
  } else if (operation === "add") {
    // Add the value to all languages
    Object.keys(data.translate).forEach((lng) => {
      updatedData.translate[lng] = {
        ...data.translate[lng],
        options: [...(data.translate[lng]?.options || []), { label: value }],
      };
    });
  }

  return updatedData;
};

export const activeLanguageData = (
  data: object,
  activeLanguage: string,
  key: string
) =>
  // @ts-ignore
  data?.translate?.[activeLanguage]?.[key] || "";
