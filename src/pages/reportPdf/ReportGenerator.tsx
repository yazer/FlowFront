import React, { useEffect } from "react";
import { getMethod } from "../../apis/ApiMethod";
import { GET_FORM_FIELDS } from "../../apis/urls";
import FreeMoveContainer from "./FreeMoveContainer";
import ReportGenerationContext from "./context/ReportGenerationContext";

function ReportGenerator({ selectedNode }: { selectedNode: string }) {
  const [formFields, setFormFields] = React.useState<any>([]);
  const [sections, setSections] = React.useState<any>([
    { id: "section-1", type: "section", items: [] },
  ]);

  useEffect(() => {
    (async () => {
      const data = await getMethod(GET_FORM_FIELDS + "/" + selectedNode);
      setFormFields(data);
    })();
  }, []);

  return (
    <ReportGenerationContext sections={sections} setSections={setSections}>
      <FreeMoveContainer
        formFields={formFields}
        sections={sections}
        setSections={setSections}
      />
    </ReportGenerationContext>
  );
}

export default ReportGenerator;
