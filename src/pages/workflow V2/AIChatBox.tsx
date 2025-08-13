import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  ButtonGroup,
  IconButton,
  Popper,
  Slide,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaWpforms } from "react-icons/fa";
import { IoGitBranch } from "react-icons/io5";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import DirectionBasedOnLanguage from "../../components/DirectionBasedOnLanguage";
import useTranslation from "../../hooks/useTranslation";
import "./aichatbox.css";

type AIChatBoxtypes = {
  placeholder?: string;
  onGenerate?: (query: string) => void;
  disableGenerate?: boolean;
  generateHelperText?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
};

function AIChatBox({
  placeholder = "Ask me anything...",
  onGenerate,
  disableGenerate = false,
  generateHelperText,
  query = "",
  onQueryChange,
}: AIChatBoxtypes) {
  const theme: any = useTheme();
  const [selectedTab, setSelectedTab] = useState("workflow");
  const { translate } = useTranslation();
  const { locale } = useIntl();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const general = !location.pathname.includes("flow-builder");
  const [text, setText] = useState(query);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (query !== text) {
      setText(query);
    }
  }, [query]);

  return (
    <DirectionBasedOnLanguage language={locale}>
      <button onClick={handleClick} className="button-trigger-ai">
        <BsStars />
      </button>
      <Popper open={open} anchorEl={anchorEl} transition placement="left">
        {({ TransitionProps }) => (
          <Slide {...TransitionProps} direction="up">
            <div
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="aicontainer"
            >
              <Box className="aiheader-container">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  p={1.3}
                  borderBottom={`1px solid ${theme.palette.border.main}`}
                >
                  <Typography variant="caption">
                    {translate(general ? "AI Chat Box" : "generateWorkflow")}
                  </Typography>
                  <Stack direction="row" alignContent="center">
                    <IconButton size="small" onClick={() => setOpen(false)}>
                      <Close sx={{ height: 14, width: 14 }} />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack padding={1.3} spacing={2}>
                  {!general && (
                    <ButtonGroup
                      variant="outlined"
                      aria-label="Basic button group"
                      size="small"
                    >
                      <Button
                        startIcon={<IoGitBranch />}
                        onClick={() => setSelectedTab("workflow")}
                        variant={
                          selectedTab === "workflow" ? "contained" : "outlined"
                        }
                        disableElevation
                      >
                        {translate("workflow")}
                      </Button>
                      <Button
                        startIcon={<FaWpforms />}
                        disableElevation
                        onClick={() => setSelectedTab("form")}
                        variant={
                          selectedTab === "form" ? "contained" : "outlined"
                        }
                      >
                        {translate("form")}
                      </Button>
                    </ButtonGroup>
                  )}
                  <Stack spacing={0.3}>
                    <textarea
                      className="ai-chat-area"
                      placeholder={placeholder}
                      rows={4}
                      onChange={(e) => {
                        if (onQueryChange) {
                          onQueryChange(e.target.value);
                        } else {
                          setText(e.target.value);
                        }
                      }}
                    />
                    {generateHelperText && (
                      <Typography variant="subtitle2" color="error">
                        {translate(generateHelperText)}
                      </Typography>
                    )}
                  </Stack>
                  <ButtonBase
                    disabled={disableGenerate}
                    className="ai-generate-button"
                    onClick={() => onGenerate && onGenerate(text)}
                  >
                    <BsStars />
                    <Typography
                      variant="subtitle1"
                      color="white"
                      className="text"
                    >
                      {translate("generate")}
                    </Typography>
                  </ButtonBase>
                </Stack>
              </Box>
            </div>
          </Slide>
        )}
      </Popper>
    </DirectionBasedOnLanguage>
  );
}

export default AIChatBox;
