// @ts-ignore
import { useIntl } from "react-intl";
import DynamicFormPopup from "../../components/Modal/DynamicForm";
import DirectionBasedOnLanguage from "../DirectionBasedOnLanguage";

interface FormPreviewProps {
  nodeId: string;
  formFields: Array<any>;
  formContainerWidth?: number;
  activeLanguage?: string;
}
export default function FormPreview({
  nodeId,
  formFields,
  formContainerWidth,
  activeLanguage,
}: FormPreviewProps) {

  const { locale } = useIntl();

  return (
    <DirectionBasedOnLanguage language={activeLanguage || locale}>
      <div className={`p-4`}>
        <DynamicFormPopup
          formData={formFields}
          onSubmit={() => {}}
          actionList={[]}
          previewActiveLang={activeLanguage}
          formContainerWidth={formContainerWidth || 100 - 200}
          isPreview={true}
        />
      </div>
    </DirectionBasedOnLanguage>
  );
}
