import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useState } from "react";
import useTranslation from "../../../hooks/useTranslation";

function AdvancedOptionsWrapper({ children }: { children: React.ReactNode }) {
  const { translate } = useTranslation();
  const [isAdvancedOptions, setIsAdvancedOptions] = useState(false);

  return (
    <div>
      <Stack alignItems="flex-end">
        <Button
          startIcon={
            isAdvancedOptions ? <KeyboardArrowUp /> : <KeyboardArrowDown />
          }
          onClick={() => setIsAdvancedOptions((state) => !state)}
        >
          {translate("form.advancedOptions")}
        </Button>
      </Stack>

      {isAdvancedOptions ? (
        <div className="px-4 rounded-md border border-gray-300">{children}</div>
      ) : null}
    </div>
  );
}

export default AdvancedOptionsWrapper;
