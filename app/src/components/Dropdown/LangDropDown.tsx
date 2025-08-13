import { Box } from "@mui/material";
import Dropdown from "./Dropdown";

function LangDropDOwn({
  handleOnClick,
  value,
}: {
  handleOnClick: (e: any) => any;
  value: any;
}) {
  return (
    <Box sx={{ "& div": { width: "100px" } }}>
      <Dropdown
        value={value}
        options={[
          { label: "English", value: "en" },
          { label: "Arabic", value: "ar" },
        ]}
        onChange={handleOnClick}
        name={"template"}
        noSelectOption
      />
    </Box>
  );
}

export default LangDropDOwn;
