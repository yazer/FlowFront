import {
  Box,
  Stack,
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
import { useIntl } from "react-intl";

const StepIconWrapper = styled("div")<{
  ownerState: StepIconProps;
}>(({ theme, ownerState }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "50%",
  padding: 2,
  border: `1px solid ${
    ownerState.active || ownerState.completed
      ? theme.palette.primary.main
      : theme.palette.grey[400]
  }`,
  backgroundColor: ownerState.completed
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color:
    ownerState.completed || ownerState.active
      ? theme.palette.common.white
      : theme.palette.text.secondary,
  transition: "all 0.3s ease",
  fontSize: 12,
}));

export function CustomStepIcon(props: StepIconProps) {
  const { active, completed } = props;
  const theme = useTheme();

  return (
    <StepIconWrapper ownerState={props}>
      {completed ? (
        <IoCheckmarkSharp size={16} />
      ) : active ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 32 32"
        >
          <path
            fill={
              completed || active
                ? theme.palette.primary.main
                : theme.palette.text.secondary
            }
            d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m0 26a12 12 0 0 1 0-24v12l8.481 8.481A11.96 11.96 0 0 1 16 28"
          />
        </svg>
      ) : (
        <MdOutlinePendingActions size={18} />
      )}
    </StepIconWrapper>
  );
}

export default function WorkFlowStepper({
  steps,
  activeStep = 0,
}: {
  steps: any[];
  activeStep?: number;
}) {
  const [entered, setEntered] = React.useState(false);
  const { locale } = useIntl();

  return (
    <Box
      sx={{
        maxWidth: 300,
        height: "100%",
        padding: 1.5,
        transition: "all 0.5s ease-in-out",
      }}
      onMouseEnter={() => setEntered(true)}
      onMouseLeave={() => setEntered(false)}
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.node[locale]}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              {entered && step.node?.[locale]}
            </StepLabel>

            <StepContent>
              {/* <Collapse
                in={entered}
                timeout={{ enter: 400, exit: 300 }}
                easing="cubic-bezier(0.4, 0, 0.2, 1)"
                unmountOnExit
              > */}
              {entered ? (
                <Box>
                  <Typography
                    variant="h6"
                    color={activeStep !== index ? "text.secondary" : undefined}
                  >
                    {step.staff_name?.[locale]}
                  </Typography>
                  <Stack>
                    <Typography
                      variant="caption"
                      color={
                        activeStep !== index ? "text.secondary" : undefined
                      }
                    >
                      {step.created_at}
                    </Typography>
                  </Stack>
                </Box>
              ) : null}
              {/* </Collapse> */}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
