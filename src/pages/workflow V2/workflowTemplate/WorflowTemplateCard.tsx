import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Star from "@mui/icons-material/Star";
import StarOutline from "@mui/icons-material/StarOutline";
import {
  alpha,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  Checkbox,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { TiFlowChildren } from "react-icons/ti";
import useTranslation from "../../../hooks/useTranslation";

function WorkFlowTemplateCard({
  template,
  selectedTemplate,
  applyTemplate,
  setPreviewOpen,
  isExpanded = false,
  onExpand = (templateId: boolean) => {},
  buttontext = "preview",
}: {
  template: any;
  selectedTemplate: string | null;
  applyTemplate: (id: string) => void;
  setPreviewOpen: React.Dispatch<React.SetStateAction<string | null>>;
  isExpanded?: boolean;
  onExpand?: any;
  buttontext?: string;
}) {
  // const [isExpanded, setIsExpanded] = React.useState(false);
  const { translate } = useTranslation();

  const selected = selectedTemplate === template.uuid;
  return (
    <ButtonBase
      disableTouchRipple
      sx={{ height: "fit-content", textAlign: "left" }}
      onClick={(e) => {
        e.stopPropagation();
        applyTemplate(template.uuid);
      }}
    >
      <>
        <Card
          sx={{
            height: "fit-content",
            border: (theme) =>
              `1.5px solid ${
                selected ? theme.palette.primary.main : "transparent"
              }`,
            background: (theme) =>
              selected ? alpha(theme.palette.primary.main, 0.05) : "white",
            // background: selected ? "#d6ebff73" : "white",
            "&:hover": {
              background: (theme) => alpha(theme.palette.primary.main, 0.02),
            },
          }}
        >
          <Box
            sx={{
              width: "230px",
            }}
            height="fit-content"
            position="relative"
            alignItems="flex-start"
          >
            <Box position="absolute" top={5} right={5}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(template.uuid);
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Stack spacing={2} padding={2}>
              <Stack spacing={1} direction="row">
                <Avatar src={template.icon_url}>
                  {template.icon_url ?? template.template_name.split("")[0]}
                </Avatar>
                <Stack spacing={0.5}>
                  <Typography variant="h5">{template.template_name}</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ height: "35px" }}
                    color="text.secondary"
                  >
                    {template.template_desc}
                  </Typography>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <MetaDataWithLabel
                  label="Category"
                  value="Human Resource"
                  icon={<TiFlowChildren />}
                />
              </Stack>

              {isExpanded && (
                <>
                  <Divider flexItem />
                  <Stack spacing={1}>
                    <MetaDataWithLabel
                      label="Template Used by Process"
                      value="Proccess1, Proccess2, Proccess3"
                      icon={<TiFlowChildren />}
                    />
                  </Stack>
                </>
              )}
            </Stack>
            <Stack direction="row" paddingX={2} justifyContent="space-between">
              <Stack direction="row">
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    applyTemplate(template.uuid);
                    setPreviewOpen(template.uuid)
                  }}
                  sx={{ textTransform: "uppercase" }}
                >
                  {translate(buttontext)}
                </Button>
              </Stack>

              <Checkbox
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                icon={<StarOutline />}
                checkedIcon={<Star />}
              />
            </Stack>
          </Box>
        </Card>
      </>
    </ButtonBase>
  );
}

export default WorkFlowTemplateCard;

function MetaDataWithLabel({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <Stack direction="row" alignItems="center">
      <Box sx={{ "& svg": { color: (theme) => theme.palette.text.secondary } }}>
        {icon}
      </Box>
      <Stack marginLeft={1}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}
