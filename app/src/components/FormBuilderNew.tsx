/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined, WarningAmber } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import Fullscreen from "@mui/icons-material/Fullscreen";
import Send from "@mui/icons-material/Send";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiTemplate } from "react-icons/hi";
import { IoSaveSharp } from "react-icons/io5";
import { VscPreview } from "react-icons/vsc";
import { FormattedMessage, useIntl } from "react-intl";
import { Node } from "reactflow";
import { getMethod, postMethod } from "../apis/ApiMethod";
import { createForm, createTemplate, getTemplates } from "../apis/flowBuilder";
import {
  GET_FORM_FIELDS,
  GET_INTELLECTA_FORM,
  TEMPLATE_DETAILS,
} from "../apis/urls";
import useTranslation from "../hooks/useTranslation";
import { returnErrorToast } from "../utils/returnApiError";
import DialogCustomized from "./Dialog/DialogCustomized";
import LangDropDOwn from "./Dropdown/LangDropDown";
import FormEditor from "./FormEditor/FormEditor";
import CheckBox from "./FormElements/components/CheckBox";
import FormElements from "./FormElements/FormElements";
import InputField from "./FormElements/newcompnents/InputField";
import TextArea from "./FormElements/newcompnents/TextArea";
import FormPreview from "./FormPreview/FormPreview";
import ReportGenerator from "../pages/reportPdf/ReportGenerator";
import { selectedCompType } from "../pages/workflow V2/Workflow";

const templateTemplate = {
  name: "",
  is_organization: false,
  is_global: false,
};
interface FormBuilderProps {
  selectedNode: Node;
  onClose: () => void;
  formContainerWidth: number;
  fullScreen?: boolean;
  handleToggleFullscreen?: () => any;
  setFullScreen?: any;
  loader: boolean;
  setLoader?: (value: boolean) => void;
  aiGeneratedForm?: Array<any> | null;
  setAiGeneratedForm?: (value: Array<any> | null) => void;
  selectedComponent: selectedCompType;
  setSelectedComponent: React.Dispatch<React.SetStateAction<selectedCompType>>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  selectedNode,
  onClose,
  handleToggleFullscreen,
  setFullScreen,
  formContainerWidth,
  loader,
  setLoader = () => {},
  aiGeneratedForm,
  setAiGeneratedForm = () => {},
  selectedComponent,
  setSelectedComponent,
}) => {
  const [formFields, setFormFields] = useState<Array<any>>([]);
  const [previousNodeId, setPreviousNodeId] = useState<string | null>(null); // Store previous node ID
  const { translate } = useTranslation();
  const [templateDialog, setTemplateDialog] = useState(false);
  const [templateForm, setTemplateForm] = useState<any>(templateTemplate);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const { locale } = useIntl();
  const [activeLanguage, setActiveLanguage] = useState<string>(locale);
  const [aiText, setAiText] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const [popup, setPopup] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<null | string>(null);

  const [templateLoader, setTemplateLoader] = useState("");
  useEffect(() => {
    // Check if the node ID has changed
    if (previousNodeId !== selectedNode.id) {
      setPreviousNodeId(selectedNode.id); // Update previousNodeId
      // setShowPreview(false); // Close the form
      // setSelectedComponent("formBuilder");
      setFormFields([]); // Clear form fields when node changes

      // Fetch new form fields for the selected node
      const fetchFormFields = async () => {
        setLoader(true);
        const response = await fetch(`${GET_FORM_FIELDS}/${selectedNode.id}`);
        const data = await response.json();
        setLoader(false);
        setTemplateDialog(false);
        setFormFields(data);
      };

      fetchFormFields();
    }
  }, [selectedNode.id, previousNodeId]);

  async function saveForm(form: any) {
    try {
      await createForm(selectedNode.id, form);
    } catch (e) {
      console.error("Error while saving form", e);
    } finally {
    }
  }
  const handlePreviewToggle = () => {
    setSelectedComponent((state) =>
      state === "formPreview" ? "formBuilder" : "formPreview"
    );
  };

  async function getTemplate() {
    setTemplateLoader("template_get_loader");

    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
    } finally {
      setTemplateLoader("");
    }
  }

  useEffect(() => {
    getTemplate();
  }, []);

  async function generateForm(query: string) {
    setIsLoading(true);
    try {
      const data = await postMethod(`${GET_INTELLECTA_FORM}`, {
        prompt: query,
      });
      setFormFields(data);
      setAiText("");
    } catch (e) {
      console.error("Error generating form", e);
      toast.error("Failed to generate form");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAsTemplate() {
    try {
      setIsLoading(true);
      await createTemplate(selectedNode.id, templateForm);
      toast.success(templateForm.name + " created successfully");
      setTemplateDialog(false);
      getTemplate();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTemplateFormChange(name: string, value: string) {
    setTemplateForm((state: object) => ({ ...state, [name]: value }));
  }

  async function handleTemplateChange() {
    setTemplateLoader("switch_template_loader");
    try {
      const data = await getMethod(
        `${TEMPLATE_DETAILS}/${selectedTemplate ?? ""}/`
      );
      setFormFields(data.form_data);
      toast.success(
        <FormattedMessage id="successMsgTemplateSwitch"></FormattedMessage>
      );
    } catch (e) {
      returnErrorToast({ error: e, locale });
    } finally {
      setSelectedTemplate(null);
      setPopup("");
      setTemplateLoader("");
    }
  }

  const handleClickTemplate = (item: any) => {
    setSelectedTemplate(item?.uuid);
  };

  console.log("selectedComponent", selectedComponent);

  return (
    <>
      <DialogCustomized
        open={aiGeneratedForm !== null && aiGeneratedForm !== undefined}
        maxWidth="lg"
        actions={
          <Button
            variant="contained"
            disableElevation
            disabled={!selectedForm}
            onClick={() => {
              if (selectedForm === "formmerge.currentForm") {
                saveForm(formFields);
                setFormFields(formFields);
              } else if (selectedForm === "formmerge.aiform") {
                saveForm(aiGeneratedForm || []);
                setFormFields(aiGeneratedForm || []);
              } else {
                saveForm([...formFields, ...(aiGeneratedForm || [])]);
                setFormFields([...formFields, ...(aiGeneratedForm || [])]);
              }
              setAiGeneratedForm(null);
            }}
          >
            {translate("cta.apply")}
          </Button>
        }
        content={
          <div className="flex flex-row gap-3">
            {[
              { label: "formmerge.currentForm", form: formFields },
              { label: "formmerge.aiform", form: aiGeneratedForm },
              {
                label: "formmerge.mergedForm",
                form: [...formFields, ...(aiGeneratedForm || [])],
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`border flex-1 border-gray-300 rounded-lg p-2 shadow-sm ${
                  selectedForm === item.label
                    ? "border-primary bg-blue-50 shadow-sm shadow-blue-50"
                    : ""
                }`}
              >
                <div className="mx-3">
                  <FormControlLabel
                    checked={selectedForm === item.label}
                    control={<Radio />}
                    onChange={(e: any) => {
                      setSelectedForm(item.label);
                    }}
                    label={translate(item.label)}
                  />
                </div>
                <FormPreview
                  nodeId={selectedNode.id}
                  formFields={item.form || []}
                  activeLanguage={activeLanguage}
                />
              </div>
            ))}
          </div>
        }
        title={"Form Preview"}
      />
      <div className="form-builder w-full h-[calc(100vh_-_113px)] flex flex-col bg-white">
        <div className="flex-grow flex border border-gray-300 overflow-y-auto overflow-x-hidden">
          <div className="flex-grow-[3] flex flex-col p-3 pt-2 border-r border-gray-00">
            <div className="flex flex-row justify-between items-center mb-2">
              {/* <Loading open={isLoading} /> */}

              {/* Show title as header on center */}
              <div className="font-bold flex flex-row items-center gap-1">
                <Tooltip title={selectedNode?.data?.label}>
                  {/* <h4 className={`truncate`} style={{ flex: 1 }}> */}
                  <Typography variant="h5" noWrap>
                    {selectedNode?.data?.translations?.[locale]?.name}
                  </Typography>
                  {/* </h4> */}
                </Tooltip>

                {selectedComponent !== "reportGenerator" ? (
                  <IconButton onClick={handleToggleFullscreen}>
                    <Fullscreen />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setSelectedComponent("formBuilder");
                      setFullScreen?.(false);
                    }}
                  >
                    <CloseOutlined />
                  </IconButton>
                )}
              </div>
              <DialogCustomized
                open={templateDialog}
                handleClose={() => setTemplateDialog(false)}
                actions={
                  <Stack direction="row" spacing={2}>
                    <Button onClick={() => setTemplateDialog(false)}>
                      {translate("cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={handleSaveAsTemplate}
                    >
                      {translate("create")}
                    </Button>
                  </Stack>
                }
                content={
                  <Stack spacing={1}>
                    <InputField
                      label={translate("templateName")}
                      value={templateForm.name}
                      onChange={(e) => handleTemplateFormChange("name", e)}
                    />
                    <Stack direction="row" spacing={2}>
                      <CheckBox
                        label={translate("is_global")}
                        isChecked={templateForm.is_global}
                        onChange={(e) =>
                          handleTemplateFormChange(
                            "is_global",
                            e.target.checked
                          )
                        }
                      />
                      <CheckBox
                        label={translate("is_organization")}
                        isChecked={templateForm.is_organization}
                        onChange={(e) =>
                          handleTemplateFormChange(
                            "is_organization",
                            e.target.checked
                          )
                        }
                      />
                    </Stack>
                  </Stack>
                }
                title={"Create Template"}
              />

              <Stack direction="row" spacing={2}>
                <LangDropDOwn
                  value={activeLanguage}
                  handleOnClick={(e) => setActiveLanguage(e.target.value)}
                />

                <Button
                  onClick={() => {
                    debugger;
                    if (selectedComponent === "reportGenerator") {
                      setSelectedComponent("formBuilder");
                      setFullScreen?.(false);
                    } else {
                      setSelectedComponent("reportGenerator");
                      setFullScreen?.(true);
                    }
                  }}
                >
                  <FormattedMessage id="openReportGenerator"></FormattedMessage>
                </Button>

                <Button
                  variant="text"
                  onClick={() => {
                    setPopup("switch_template");
                  }}
                >
                  <FormattedMessage id="TemplateSwitch"></FormattedMessage>
                </Button>

                {/* <Dropdown
                  options={templates}
                  labelKey="name"
                  valueKey="uuid"
                  onChange={handleTemplateChange}
                  name={"template"}
                /> */}
                <Tooltip title={translate("saveAsTemplate")}>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => setTemplateDialog(true)}
                  >
                    <IoSaveSharp />
                  </IconButton>
                </Tooltip>

                <Button
                  onClick={handlePreviewToggle}
                  size="small"
                  variant="text"
                  sx={{
                    textTransform: "capitalize",
                  }}
                  startIcon={<VscPreview />}
                >
                  {selectedComponent === "formPreview" ? (
                    <FormattedMessage id="formText"></FormattedMessage>
                  ) : (
                    <FormattedMessage id="previewText"></FormattedMessage>
                  )}
                </Button>
                <IconButton size="small" onClick={onClose}>
                  <Close
                    style={{
                      fontSize: "16px",
                    }}
                  />
                </IconButton>
              </Stack>
            </div>
            <div className="form-builder-container flex-grow border-[1px] rounded-md border-gray-300 bg-[#f6f8fa] max-h-full overflow-auto">
              {isLoading && (
                <div className="flex flex-col items-center w-full p-2 gap-2">
                  {[1, 2, 3].map((item) => (
                    <Skeleton
                      key={item}
                      variant="rectangular"
                      width={"100%"}
                      height={80}
                      style={{
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
              )}

              {!isLoading && (
                <>
                  {selectedComponent === "formBuilder" &&
                    (formFields.length === 0 ? (
                      <div className="text-center text-gray-500">
                        <FormattedMessage id="formBuilderNoItems" />
                      </div>
                    ) : (
                      <FormEditor
                        formContainerWidth={formContainerWidth}
                        updateFormData={setFormFields}
                        initialData={formFields}
                        selectedNodeId={selectedNode.id}
                        loader={loader}
                        activeLanguage={activeLanguage}
                      />
                    ))}

                  {selectedComponent === "formPreview" && (
                    <FormPreview
                      nodeId={selectedNode.id}
                      formFields={formFields}
                      formContainerWidth={formContainerWidth}
                      activeLanguage={activeLanguage}
                    />
                  )}

                  {selectedComponent === "reportGenerator" && (
                    <ReportGenerator selectedNode={selectedNode.id} />
                  )}
                </>
              )}
            </div>
            {selectedComponent !== "reportGenerator" && (
              <div className="mt-2 flex flex-row items-end border-gray-200 border rounded-md p-1 shadow-sm shadow-gray-200">
                <TextArea
                  rows={2}
                  label={undefined}
                  placeholder="Generate form"
                  variant="no-outline"
                  value={aiText}
                  onChange={(e) => setAiText(e)}
                />
                <IconButton
                  color="primary"
                  size="small"
                  className="ml-2"
                  onClick={() => generateForm(aiText)}
                  disabled={isLoading || aiText.trim() === ""}
                >
                  <Send />
                </IconButton>
              </div>
            )}
          </div>
          {selectedComponent !== "reportGenerator" && (
            <div className="min-w-[80px]">
              <FormElements />
            </div>
          )}
        </div>
      </div>

      <DialogCustomized
        maxWidth="lg"
        open={popup === "switch_template"}
        // handleClose={() => {
        //   setPopup("");
        // }}
        title={translate("selectTemplate")}
        content={
          <>
            {templateLoader === "template_get_loader" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "400px",
                }}
              >
                <CircularProgress sx={{ height: "10px", width: "10px" }} />
              </div>
            ) : templates.length > 0 ? (
              <div className="h-full overflow-y-auto">
                <Grid container spacing={2}>
                  {templates?.map((item: any, index: number) => (
                    <Grid item md={3} xs={12} lg={3} sm={6} xl={2}>
                      <TemplateCard
                        data={item}
                        onClick={() => {
                          handleClickTemplate(item);
                        }}
                        selectedTemplate={selectedTemplate}
                      ></TemplateCard>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ) : (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fdf4f4",
                  border: "1px solid #e0c4c4",
                  borderRadius: "6px",
                  color: "#a33",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                <FormattedMessage id="noTemplates" />
              </div>
            )}
          </>
        }
        actions={
          <Stack spacing={2} direction="row" justifyContent="flex-end">
            <Button
              size="small"
              onClick={() => {
                setPopup("");
                setSelectedTemplate(null);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              size="small"
              onClick={() => {
                setPopup("confirm_template");
              }}
              disabled={!selectedTemplate}
            >
              {translate("TemplateSwitch")}
            </Button>
          </Stack>
        }
      ></DialogCustomized>

      <DialogCustomized
        open={popup === "confirm_template"}
        handleClose={() => {
          setPopup("");
          setSelectedTemplate(null);
        }}
        title={<FormattedMessage id="TemplateSwitch" />}
        content={
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            gap={1.5}
            p={2}
            borderRadius={2}
          >
            <WarningAmber color="info" sx={{ fontSize: "3rem" }} />
            <Typography variant="body1">
              <FormattedMessage id="questionSwitchTemplate"></FormattedMessage>
            </Typography>
          </Box>
        }
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setPopup("");
                setSelectedTemplate(null);
              }}
              // disabled={restoreLoader}
              disabled={templateLoader === "switch_template_loader"}
            >
              <FormattedMessage id="cancel"></FormattedMessage>
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={() => handleTemplateChange()}
              disabled={templateLoader === "switch_template_loader"}
            >
              <FormattedMessage id="TemplateSwitch"></FormattedMessage>
            </Button>
          </Stack>
        }
      />
    </>
  );
};

export default memo(FormBuilder);

export const TemplateCard = ({
  data,
  onClick,
  selectedTemplate,
}: {
  data: any;
  onClick: any;
  selectedTemplate: any;
}) => {
  return (
    <div
      className={`cursor-pointer max-w-sm w-full rounded-xl shadow-md border p-4 flex flex-col justify-between bg-white ${
        selectedTemplate === data?.uuid
          ? "border-primary border-2"
          : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xl font-bold">
          <HiTemplate />
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          Business
        </span>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">{data?.name}</h2>

      <p className="text-sm text-gray-500">Created on: July 5, 2025</p>
    </div>
  );
};
