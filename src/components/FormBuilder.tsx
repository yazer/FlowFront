import { memo, useEffect, useState } from "react";
import { Node } from "reactflow";
import { BASE_URL } from "../apis/urls";
import FormEditor from "./FormEditor/FormEditor";
import FormElements from "./FormElements/FormElements";
import LangTab from "./FormElements/newcompnents/LangTab";
import FormPreview from "./FormPreview/FormPreview";
import { Typography } from "@mui/material";

interface FormBuilderProps {
  selectedNode: Node;
  onClose: () => void;
  listworkflowNode: () => any;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  selectedNode,
  onClose,
  listworkflowNode,
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<Array<any>>([]);
  const [previousNodeId, setPreviousNodeId] = useState<string | null>(null); // Store previous node ID
  const [activeLanguage, setActiveLanguage] = useState<string>("en");

  useEffect(() => {
    // Check if the node ID has changed
    if (previousNodeId !== selectedNode.id) {
      setPreviousNodeId(selectedNode.id); // Update previousNodeId
      setShowPreview(false); // Close the form
      setFormFields([]); // Clear form fields when node changes

      // Fetch new form fields for the selected node
      const fetchFormFields = async () => {
        const response = await fetch(
          `${BASE_URL}/workflow/form-fields/${selectedNode.id}`
        );
        const data = await response.json();
        setFormFields(data); // Set the fetched form fields
      };

      fetchFormFields();
    }
  }, [selectedNode.id, previousNodeId]);

  const handlePreviewToggle = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <div className="w-full h-[calc(100vh_-_4rem)] flex flex-col">
      <div className="flex-grow flex border border-gray-300 overflow-y-auto">
        <div className="flex-grow-[3] flex flex-col p-4 border-r border-gray-00">
          <div className="flex flex-row justify-between">
            {/* Show title as header on center */}
            <div className="text-xl font-bold">
              {/* <h2>{selectedNode.data.label}</h2> */}
              <Typography variant="h5">{selectedNode.data.label}</Typography>
            </div>
            <LangTab
              activeLanguage={activeLanguage}
              setActiveLanguage={setActiveLanguage}
            />
            <button onClick={handlePreviewToggle} className="text-[#0060AB]">
              {showPreview ? "Form" : "Preview"}
            </button>
          </div>
          <div className="flex-grow border-[1px] rounded-md border-gray-300 px-5 pb-5 mt-4 bg-[#f6f8fa] max-h-full overflow-auto">
            {showPreview === false ? (
              formFields.length === -1 ? (
                <div className="text-center text-gray-500">
                  No form items available.
                </div>
              ) : (
                <FormEditor
                  formContainerWidth={0}
                  updateFormData={(data) => {
                    setFormFields(data);
                  }}
                  initialData={formFields}
                  selectedNodeId={selectedNode.id} // Pass selectedNodeId
                  activeLanguage={activeLanguage} // Pass activeLanguage
                />
              )
            ) : (
              <FormPreview nodeId={selectedNode.id} formFields={formFields} />
            )}
          </div>
        </div>
        <div className="min-w-[80px]">
          <FormElements />
        </div>
      </div>
    </div>
  );
};

export default memo(FormBuilder);
