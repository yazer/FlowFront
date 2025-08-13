import Close from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DialogCustomized from "../../../components/Dialog/DialogCustomized";
import useTranslation from "../../../hooks/useTranslation";
import WorkflowPreview from "./templatePreview/workflow";
import WorkFlowTemplateCard from "./WorflowTemplateCard";

function WorkflowTemplateList({
  templates,
  onClose,
  selectedTemplate,
  applyTemplate,
  width = "500px",
  processDetails,
  handleSwitchTemplate,
  loading,
}: {
  templates: any;
  onClose?: () => void;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTemplate: string | null;
  applyTemplate: (id: string) => void;
  width?: string | number;
  processDetails: any;
  handleSwitchTemplate: (id?: string) => void;
  loading: boolean;
}) {
  const { translate } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);
  const [templatesList, setTemplatesList] = useState<any>(templates);
  const [searchString, setSearchString] = useState<string>("");
  const { locale } = useIntl();
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>();

  function getTextBylang(process: any, key: string) {
    if (
      process.translations &&
      process.translations[locale] &&
      process.translations[locale][key]
    ) {
      return process.translations?.[locale]?.[key];
    }
    return process[key];
  }

  return (
    <>
      <Stack
        sx={{
          background: "#f9f9fb",
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <div className="flex flex-row justify-between px-3 py-1 items-center min-h-[50px]">
          {/* <Typography variant="h5">{"Workflow Templates"}</Typography> */}

          <div className="flex items-center gap-3">
            <Avatar
              src={processDetails.icon_url || ""}
              sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
            >
              {processDetails.name?.charAt(0)}
            </Avatar>
            <Stack>
              <Typography variant="h5">{processDetails?.name}</Typography>
              <Typography
                variant="subtitle2"
                className="truncate overflow-hidden whitespace-nowrap w-50"
                color="text.secondary"
              >
                {getTextBylang(processDetails, "description")?.length > 50
                  ? `${getTextBylang(processDetails, "description")?.substring(
                      0,
                      50
                    )}...`
                  : getTextBylang(processDetails, "description")}
              </Typography>
            </Stack>
          </div>

          <Stack
            direction={"row"}
            gap={1.5}
            divider={<Divider orientation="vertical" flexItem />}
            alignItems="center"
          >
            <MetaDataWithLabel
              processDetails={processDetails}
              label={"category"}
            />
            <MetaDataWithLabel
              processDetails={processDetails}
              label={"branch"}
            />

            <MetaDataWithLabel
              processDetails={processDetails}
              label={"section"}
            />
          </Stack>

          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </div>
        <Divider flexItem />

        <Stack alignItems="flex-end" padding={1} paddingRight={2}>
          <TextField
            value={searchString}
            placeholder={translate("searchTemplatePlaceholder")}
            size="small"
            onChange={(e) => {
              let value = e.target.value;
              setSearchString(value);
              if (value) {
                setTemplatesList(
                  templates.filter((template: any) =>
                    template.template_name
                      .toLowerCase()
                      .includes(value?.toLowerCase())
                  )
                );
              } else {
                setTemplatesList(templates);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          height="100%"
          overflow="auto"
          direction="row"
          flexWrap="wrap"
          width={width}
          padding={1}
          gap={1.5}
        >
          {templatesList.map((template: any) => (
            <WorkFlowTemplateCard
              buttontext={template.order_no === 0 ? "start" : "preview"}
              selectedTemplate={selectedTemplate}
              key={template.uuid}
              template={template}
              applyTemplate={applyTemplate}
              isExpanded={expandedTemplate === template.uuid}
              onExpand={(id: string) => {
                setExpandedTemplate(expandedTemplate === id ? null : id);
              }}
              setPreviewOpen={() => {
                if (template.order_no === 0) {
                  applyTemplate(template.uuid);
                  handleSwitchTemplate(template.uuid);
                } else {
                  setPreviewOpen(template.uuid);
                }
              }}
            />
          ))}
        </Stack>
      </Stack>
      <DialogCustomized
        maxWidth="xl"
        open={!!previewOpen}
        handleClose={() => setPreviewOpen(null)}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => {
                setPreviewOpen(null);
              }}
            >
              {translate("cancel")}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => {
                handleSwitchTemplate();
              }}
              disabled={loading}
            >
              {translate("switchTemplate")}
            </Button>
          </Stack>
        }
        content={<WorkflowPreview templateId={previewOpen} />}
        title={<FormattedMessage id="templatePreview"></FormattedMessage>}
      />
    </>
  );
}

export default WorkflowTemplateList;

function MetaDataWithLabel({
  processDetails,
  label,
}: {
  processDetails: any;
  label: string;
}) {
  const { translate } = useTranslation();
  const { locale } = useIntl();

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Typography variant="subtitle2" color="text.secondary">
        {translate(label)}:
      </Typography>
      <Typography variant="caption" color="text.primary">
        {processDetails?.translations?.[locale]?.[label] ??
          translate("notSpecified")}
      </Typography>
    </Stack>
  );
}
