import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import useTranslation from "../../../hooks/useTranslation";
import { elements_type } from "../constants";
import { activeLanguageData, updateTranslationData } from "../formTranslations";
import InputField from "./InputField";
import FormElementPreviewContainer from "../FormElementPreviewContainer";

interface TextProps {
  collapse: string;
  formElement: any;
  en: string;
  ar: string;
  onDelete: () => void;
  onChange: (values: {
    en?: string;
    ar?: string;
    element_type: string;
    value: string;
  }) => any;
  activeLanguage: any;
}

const Text: FC<TextProps> = ({
  collapse,
  formElement,
  onChange,
  activeLanguage,
}) => {
  const { translate } = useTranslation();
  const [localData, setLocalData] = useState({
    id: formElement.id || "",
    value: formElement.value || "",
    element_type: elements_type.TITLE,
    translate: formElement?.translate || {},
  });

  const handleChange = (value: string) => {
    const updatedData = updateTranslationData(
      localData,
      "labelTitle",
      elements_type.TITLE,
      value,
      activeLanguage
    );
    setLocalData(updatedData);
  };

  const handleBlur = () => {
    onChange({ ...localData, element_type: elements_type.TITLE });
  };

  function activeLanguageuageDataa(key: string) {
    return activeLanguageData(localData, activeLanguage, key);
  }

  const isExpanded = collapse === formElement.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          {activeLanguageuageDataa("labelTitle") && (
            <p className="text-gray-800 text-center">
              {activeLanguageuageDataa("labelTitle")}
            </p>
          )}
          {!activeLanguageuageDataa("labelTitle") && (
            <p className="text-gray-400 text-center">
              <FormattedMessage id="noDataTitle"></FormattedMessage>
            </p>
          )}
        </FormElementPreviewContainer>
      )}

      {isExpanded && (
        <div>
          <div className="p-4">
            <InputField
              value={activeLanguageuageDataa("labelTitle")}
              // label="Title (English)"
              label={translate("labelTitle")}
              placeholder={translate("placeHolderTitle")}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Text;
